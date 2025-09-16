import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, AlertCircle, Link, Webhook, CheckCircle, Languages } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Message } from '../types/chat';
import { useSamChat } from '../hooks/useSamChat';
import { sendToMakeWebhook } from '../services/webhook';
import { Language } from '../services/openai';
import { generateDealerEmailSubject, generateDealerEmailBody } from '../utils/dealerEmail';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

export function Chat() {
  const { history, send, restart, language, switchLanguage } = useSamChat();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [welcomeMessage, setWelcomeMessage] = useState<Message | null>(null);
  const [lastWebhookPayload, setLastWebhookPayload] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear everything on component mount to ensure fresh start
  useEffect(() => {
    restart();
    setLastWebhookPayload(null);
    setWelcomeMessage(null);
  }, []);

  // Clear everything on component mount to ensure fresh start
  useEffect(() => {
    restart();
    setLastWebhookPayload(null);
    setWelcomeMessage(null);
  }, []);

  // Convert Sam chat history to Message format for display
  const historyMessages: Message[] = history.map((msg, index) => ({
    id: index.toString(),
    role: msg.role,
    content: msg.content,
    timestamp: new Date(),
  }));

  // Combine welcome message with history
  const messages: Message[] = welcomeMessage 
    ? [welcomeMessage, ...historyMessages]
    : historyMessages;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // Initialize welcome message
  useEffect(() => {
    if (history.length === 0 && !welcomeMessage) {
      const welcomeText = language === 'en' ? 
        "Hello! Ready to let me find the best deal for a vehicle? Car, SUV or pickup, I can help! What BRAND are you looking for?" :
        "Bonjour! Prêt à me laisser dénicher la meilleure offre pour un véhicule ? Auto, VUS ou pick-up, je peux vous aider ! Quelle marque recherchez vous ?";
        
      setWelcomeMessage({
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date(),
      });
    } else if (history.length > 0 && welcomeMessage) {
      // Remove welcome message once real conversation starts
      setWelcomeMessage(null);
    }
  }, [history.length, welcomeMessage, language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Read URL parameters when component mounts
    const params = new URLSearchParams(window.location.search);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Search params:', window.location.search);
    console.log('🔍 Hash:', window.location.hash);
    
    // Also check hash-based parameters (for /#/chat?navigation=denis)
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    console.log('🔍 Hash params:', hashParams.toString());
    
    if (hashParams.toString()) {
      // Merge hash params with regular params
      hashParams.forEach((value, key) => {
        console.log('🔍 Adding hash param:', key, '=', value);
        params.set(key, value);
      });
    }
    
    console.log('🔍 Final params:', params.toString());
    setUrlParams(params);

  }, []);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Sam's chat system
      await send(content);
      
      // Don't send webhook here - wait for history to update
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Send webhook when history updates with new assistant response
  useEffect(() => {
    if (history.length > 0 && !isLoading) {
      const latestMessage = history[history.length - 1];
      
      // Only send webhook when we get the FINAL completion message with 🚀
      if (latestMessage.role === 'assistant' && 
          (latestMessage.content.includes('🚀') && 
           (latestMessage.content.includes('Parfait ! Je mets la pression') ||
            latestMessage.content.includes('Perfect! I\'m putting pressure')))) {
        console.log('🚀 Final completion detected, sending webhook');
        sendWebhookWithCurrentData();
      }
    }
  }, [history, isLoading]);

  const sendWebhookWithCurrentData = async () => {
    // Use the current complete history
    const currentHistory = [...history];
    
    const webhookPayload = {
      message: currentHistory.length > 1 ? currentHistory[currentHistory.length - 2]?.content || 'User message' : 'User message',
      response: currentHistory[currentHistory.length - 1]?.content || 'Assistant response',
      timestamp: new Date().toISOString(),
      conversationId: `conv_${Date.now()}`,
      fullHistory: currentHistory,
      email: "test@example.com",
      emailDealerSubject: generateDealerEmailSubject(currentHistory, language),
      emailDealerBody: generateDealerEmailBody(currentHistory, language)
    };
    
    // Store payload for display
    setLastWebhookPayload(webhookPayload);

    // Send to Make.com webhook
    setWebhookStatus('sending');
    try {
      await sendToMakeWebhook(webhookPayload);
      console.log('Webhook sent successfully');
      setWebhookStatus('success');
      setTimeout(() => setWebhookStatus('idle'), 3000);
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      setWebhookStatus('error');
      setTimeout(() => setWebhookStatus('idle'), 3000);
    }
  };

  const handleSendMessage_old = async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Sam's chat system
      await send(content);
      
      // Wait a bit for the history to update, then get the latest response
      setTimeout(() => {
        // Get the updated history from the hook
        const latestResponse = history[history.length - 1]?.content || '';
        
        const webhookPayload = {
          message: content,
          response: latestResponse,
          timestamp: new Date().toISOString(),
          conversationId: `conv_${Date.now()}`,
          fullHistory: history,
          email: "test@example.com",
          emailDealerSubject: generateDealerEmailSubject(history, language),
          emailDealerBody: generateDealerEmailBody(history, language)
        };
        
        // Store payload for display
        setLastWebhookPayload(webhookPayload);

        // Send to Make.com webhook if enabled
        if (webhookEnabled) {
          setWebhookStatus('sending');
          sendToMakeWebhook(webhookPayload)
            .then(() => {
              console.log('Webhook sent successfully');
              setWebhookStatus('success');
              setTimeout(() => setWebhookStatus('idle'), 3000);
            })
            .catch((webhookError) => {
              console.error('Webhook error:', webhookError);
              setWebhookStatus('error');
              setTimeout(() => setWebhookStatus('idle'), 3000);
            });
        }
      }, 500); // Increased timeout to ensure history is updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    switchLanguage(newLanguage);
    setLastWebhookPayload(null);
    setWelcomeMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-col flex-1 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-2 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={24} />
            <h1 className="text-lg font-semibold">
              {/* Mobile version */}
              <span className="block md:hidden">
                {language === 'en' ? 'Sam, your AI Auto Expert!' : 'Sam, votre Expert Auto IA !'}
              </span>
              {/* Desktop version */}
              <span className="hidden md:block">
                {language === 'en' ? 'Sam, your AI Auto Expert who negotiates the best price for you!' : 'Sam, votre Expert Auto IA pour le meilleur prix sans travail!'}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg p-1">
              <Languages size={16} className="text-white" />
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'fr' 
                    ? 'bg-white text-indigo-700' 
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-white text-indigo-700' 
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                EN
              </button>
            </div>
            
            {webhookStatus !== 'idle' && (
              <div className="flex items-center gap-2 text-white">
                <Webhook size={16} />
                <span className="text-sm">
                  {language === 'en' ? 'Webhook status' : 'Statut webhook'}
                </span>
                {webhookStatus === 'sending' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {webhookStatus === 'success' && (
                  <CheckCircle size={16} className="text-green-200" />
                )}
                {webhookStatus === 'error' && (
                  <AlertCircle size={16} className="text-red-200" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL Parameters Display */}
      {urlParams && urlParams.toString() && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b p-2 flex-shrink-0">
          <div className="text-sm text-indigo-800">
            <strong>{language === 'en' ? 'URL Parameters:' : 'Paramètres URL:'}</strong>
            <div className="mt-1 space-y-1">
              {Array.from(urlParams.entries()).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-medium">{key}:</span>
                  <span className="text-indigo-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testing Section - Webhook Payload Display */}
      {lastWebhookPayload && (
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b p-2 flex-shrink-0">
          <div className="text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-emerald-800">
                {language === 'en' 
                  ? 'Testing - Make.com Webhook Payload'
                  : 'Test - Payload Webhook Make.com'
                }
              </span>
            </div>
            <div className="bg-white p-3 rounded border text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
              <pre className="text-xs">{JSON.stringify(lastWebhookPayload, null, 2)}</pre>
            </div>
            <div className="mt-2 text-xs text-emerald-700">
              {language === 'en'
                ? '↑ This is the exact payload that will be sent to Make.com webhook'
                : '↑ Ceci est le payload exact qui sera envoyé au webhook Make.com'
              }
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-96 chat-messages-container">
        <div className="space-y-0">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3 p-2 bg-gray-50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Sam' : 'Sam'}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-pulse">
                    {language === 'en' ? 'Thinking...' : 'Réflexion...'}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-2 flex-shrink-0">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} />
      </div>
      
      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}