export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  latency?: number;
  tokenCount: number;
  wordCount: number;
  modelName?: string;
}

export interface ChatState {
  messages: Message[];
  apiKey: string;
  systemPrompt: string;
  modelName: string;
  chatTitle: string;
}