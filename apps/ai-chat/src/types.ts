export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ApiSettings {
  baseUrl: string; // OpenAI-compatible chat completions base, e.g. https://api.openai.com/v1
  apiKey: string;
  model: string;
}
