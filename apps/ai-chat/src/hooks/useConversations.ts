import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadConversations, saveConversations } from '../storage/conversationStorage';
import { sendChatCompletion, ChatApiError } from '../api/chatClient';
import { ChatMessage, Conversation, ApiSettings } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function titleFromFirstMessage(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed || 'New chat';
}

export function useConversations(settings: ApiSettings) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadConversations().then((loaded) => {
      setConversations(loaded);
      setActiveId(loaded[0]?.id ?? null);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveConversations(conversations);
  }, [conversations, isLoaded]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const createConversation = useCallback(() => {
    const now = Date.now();
    const conversation: Conversation = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    return conversation.id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      let targetId = activeId;
      const now = Date.now();
      const userMessage: ChatMessage = { id: generateId(), role: 'user', content: trimmed, createdAt: now };

      if (!targetId) {
        const conversation: Conversation = {
          id: generateId(),
          title: titleFromFirstMessage(trimmed),
          messages: [userMessage],
          createdAt: now,
          updatedAt: now,
        };
        setConversations((prev) => [conversation, ...prev]);
        setActiveId(conversation.id);
        targetId = conversation.id;
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  title: c.messages.length === 0 ? titleFromFirstMessage(trimmed) : c.title,
                  messages: [...c.messages, userMessage],
                  updatedAt: now,
                }
              : c
          )
        );
      }

      setIsSending(true);
      try {
        const conversationSnapshot = conversations.find((c) => c.id === targetId);
        const historyForApi = [...(conversationSnapshot?.messages ?? []), userMessage];
        const replyText = await sendChatCompletion(settings, historyForApi);

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: replyText,
          createdAt: Date.now(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetId ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: Date.now() } : c
          )
        );
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: err instanceof ChatApiError ? err.message : 'Something went wrong. Please try again.',
          createdAt: Date.now(),
          isError: true,
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetId ? { ...c, messages: [...c.messages, errorMessage], updatedAt: Date.now() } : c
          )
        );
      } finally {
        setIsSending(false);
      }
    },
    [activeId, conversations, isSending, settings]
  );

  return {
    conversations,
    activeConversation,
    activeId,
    isLoaded,
    isSending,
    setActiveId,
    createConversation,
    deleteConversation,
    sendMessage,
  };
}
