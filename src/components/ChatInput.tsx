import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Language } from '../services/openai';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: Language;
}

export function ChatInput({ onSendMessage, isLoading, language }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-2 flex-shrink-0">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={language === 'en' ? 'Type your message...' : 'Tapez votre message...'}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-3 py-2 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white rounded-lg hover:from-blue-700 hover:via-indigo-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 text-sm"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {language === 'en' ? 'Send' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
}