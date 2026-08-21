import { ApiSettings, ChatMessage } from '../types';

export class ChatApiError extends Error {}

function toApiMessages(messages: ChatMessage[]): { role: string; content: string }[] {
  return messages
    .filter((m) => m.role !== 'system' || m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Sends the conversation to an OpenAI-compatible /chat/completions endpoint
 * and returns the assistant's reply text. Works with OpenAI itself, or any
 * compatible gateway (the user configures baseUrl in Settings).
 */
export async function sendChatCompletion(settings: ApiSettings, messages: ChatMessage[]): Promise<string> {
  if (!settings.apiKey.trim()) {
    throw new ChatApiError('No API key configured. Add one in Settings.');
  }

  const url = `${settings.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: toApiMessages(messages),
        temperature: 0.7,
      }),
    });
  } catch (err) {
    throw new ChatApiError(`Network error: ${err instanceof Error ? err.message : 'unknown'}`);
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error?.message || JSON.stringify(body);
    } catch {
      detail = await response.text().catch(() => '');
    }
    throw new ChatApiError(`API error ${response.status}: ${detail || response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new ChatApiError('Unexpected response shape from API');
  }
  return content;
}
