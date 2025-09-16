import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types/chat';
import { Language } from '../services/openai';

interface ChatMessageProps {
  message: Message;
  language?: Language;
}

export function ChatMessage({ message, language = 'fr' }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Filter out recap sections for display while keeping them in the actual conversation
  const getDisplayContent = (content: string) => {
    if (message.role === 'assistant') {
      // Remove recap sections - more comprehensive pattern
      let filteredContent = content;
      
      // Pattern 1: Remove everything from 📋 until --- (including the ---)
      filteredContent = filteredContent.replace(/📋[\s\S]*?---\s*/g, '');
      
      // Pattern 2: Remove any remaining lines that start with ✅
      filteredContent = filteredContent.replace(/^✅.*$/gm, '');
      
      // Pattern 3: Clean up multiple consecutive newlines
      filteredContent = filteredContent.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      // Pattern 4: Remove leading/trailing whitespace
      filteredContent = filteredContent.trim();
      
      return filteredContent;
    }
    return content;
  };
  
  return (
    <div className={`flex gap-2 p-2 ${isUser ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50' : 'bg-gray-50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white' : 'bg-gray-500 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="flex-1">
        <div className="font-medium text-xs text-gray-600 mb-1">
          {isUser ? (language === 'en' ? 'You' : 'Vous') : 'Sam'}
        </div>
        <div className="text-gray-800 whitespace-pre-wrap text-sm">
          {getDisplayContent(message.content)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}