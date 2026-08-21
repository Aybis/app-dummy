import React, { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../../types';
import { MessageBubble } from '../molecules/MessageBubble';
import { ChatInput } from '../molecules/ChatInput';
import { colors, spacing } from '../../theme';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isSending: boolean;
  inputDisabled: boolean;
}

export function ChatScreen({ messages, onSend, isSending, inputDisabled }: ChatScreenProps) {
  const listRef = useRef<FlatList>(null);

  if (messages.length === 0) {
    return (
      <View style={styles.flex}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>How can I help you today?</Text>
          <Text style={styles.emptySubtitle}>Ask me anything — this runs against your own API key.</Text>
        </View>
        <ChatInput onSend={onSend} isSending={isSending} disabled={inputDisabled} />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <ChatInput onSend={onSend} isSending={isSending} disabled={inputDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
