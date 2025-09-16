export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}