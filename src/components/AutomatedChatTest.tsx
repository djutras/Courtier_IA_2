import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock, Zap, MessageCircle } from 'lucide-react';
import { useSamChat } from '../hooks/useSamChat';
import { sendToMakeWebhook } from '../services/webhook';
import { generateDealerEmailSubject, generateDealerEmailBody } from '../utils/dealerEmail';
import { Language } from '../services/openai';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

interface TestStep {
  question: string;
  answer: string;
  expectedKeywords?: string[];
}

interface TestResult {
  step: number;
  question: string;
  answer: string;
  response: string;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export function AutomatedChatTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [speed, setSpeed] = useState(2000); // milliseconds between steps
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Use the actual Sam chat hook
  const { history, send, restart, language, switchLanguage } = useSamChat();

  const testSteps: TestStep[] = [
    {
      question: "Quelle MARQUE recherchez-vous ?",
      answer: "Toyota",
      expectedKeywords: ["neuf", "usagé", "récapitulatif"]
    },
    {
      question: "Neuf ou usagé ?",
      answer: "Neuf",
      expectedKeywords: ["modèle", "récapitulatif"]
    },
    {
      question: "Quel MODÈLE exactement ?",
      answer: "Camry",
      expectedKeywords: ["finition", "niveau", "récapitulatif"]
    },
    {
      question: "Quel niveau de finition ou ensemble ?",
      answer: "XLE",
      expectedKeywords: ["concessionnaires", "contacter", "récapitulatif"]
    },
    {
      question: "Combien de concessionnaires dois-je contacter ?",
      answer: "3",
      expectedKeywords: ["contacté", "courriel", "sms", "récapitulatif"]
    },
    {
      question: "Comment préférez-vous être contacté ?",
      answer: "Courriel",
      expectedKeywords: ["courriel", "téléphone", "récapitulatif"]
    },
    {
      question: "Quel est votre nom complet ?",
      answer: "Jean Dupont",
      expectedKeywords: ["courriel", "téléphone", "récapitulatif"]
    },
    {
      question: "Votre meilleur courriel et numéro de téléphone ?",
      answer: "test@example.com et 514-123-4567",
      expectedKeywords: ["ville", "récapitulatif"]
    },
    {
      question: "Dans quelle ville résidez-vous ?",
      answer: "Montréal",
      expectedKeywords: ["confidentialité", "niveau", "récapitulatif"]
    },
    {
      question: "Niveau de confidentialité :",
      answer: "A", 
      expectedKeywords: ["profil", "complet", "exact", "récapitulatif"]
    },
    {
      question: "Voici votre profil complet",
      answer: "Oui",
      expectedKeywords: ["parfait", "pression", "concessionnaires", "🚀"]
    }
  ];

  const scrollToBottom = () => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [results]);

  // Monitor history changes to detect when Sam responds
  const [lastHistoryLength, setLastHistoryLength] = useState(0);
  const [lastAssistantMessageIndex, setLastAssistantMessageIndex] = useState(-1);
  const [responseTimeout, setResponseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastProcessedHistoryLength, setLastProcessedHistoryLength] = useState(0);
  
  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev.slice(-10), `${timestamp}: ${info}`]); // Keep last 10 entries
  };
  
  useEffect(() => {
    const historyInfo = `History: ${lastHistoryLength} -> ${history.length}, waiting: ${waitingForResponse}`;
    addDebugInfo(historyInfo);
    
    // Detect if history was pruned (significant decrease in length)
    if (lastHistoryLength > 0 && history.length < lastHistoryLength - 2) {
      addDebugInfo(`🔄 History pruned! Resetting assistant index tracking`);
      setLastAssistantMessageIndex(-1); // Reset tracking after pruning
    }
    
    if (waitingForResponse && isRunning && history.length > 0) {
      // Look for the latest assistant message
      let latestAssistantIndex = -1;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].role === 'assistant') {
          latestAssistantIndex = i;
          break;
        }
      }
      
      const indexInfo = `Assistant msg index: ${latestAssistantIndex}, last processed: ${lastAssistantMessageIndex}`;
      addDebugInfo(indexInfo);
      
      // If we found a new assistant message that we haven't processed yet
      if (latestAssistantIndex > lastAssistantMessageIndex && latestAssistantIndex >= 0) {
        const latestResponse = history[latestAssistantIndex];
        const responseInfo = `✅ Processing NEW response for step ${currentStep}`;
        addDebugInfo(responseInfo);
        
        // Clear any existing timeout
        if (responseTimeout) {
          clearTimeout(responseTimeout);
          setResponseTimeout(null);
        }
        
        setLastAssistantMessageIndex(latestAssistantIndex);
        processResponse(latestResponse.content);
        setWaitingForResponse(false);
      } else {
        const noResponseInfo = '⏳ No new assistant response found';
        addDebugInfo(noResponseInfo);
      }
    }
    setLastHistoryLength(history.length);
  }, [history, lastHistoryLength, waitingForResponse, isRunning, currentStep, lastAssistantMessageIndex]);
  
  // Set up timeout for responses
  useEffect(() => {
    if (waitingForResponse && isRunning) {
      const timeout = setTimeout(() => {
        addDebugInfo(`⚠️ Response timeout for step ${currentStep}`);
        
        // Try to continue anyway or show error
        const errorResult: TestResult = {
          step: currentStep,
          question: testSteps[currentStep - 1]?.question || 'Unknown',
          answer: testSteps[currentStep - 1]?.answer || 'Unknown',
          response: '',
          success: false,
          error: 'Response timeout - Sam did not respond within 15 seconds',
          timestamp: new Date()
        };
        
        setResults(prev => [...prev, errorResult]);
        setWaitingForResponse(false);
        
        // Try to continue to next step after timeout
        if (!isPaused && currentStep < testSteps.length) {
          setTimeout(() => {
            continueToNextStep();
          }, 2000);
        }
      }, 15000); // 15 second timeout
      
      setResponseTimeout(timeout);
      
      return () => {
        clearTimeout(timeout);
        setResponseTimeout(null);
      };
    }
  }, [waitingForResponse, isRunning, currentStep]);

  const processResponse = (response: string) => {
    const step = testSteps[currentStep - 1];
    if (!step) {
      addDebugInfo(`❌ No step found for current step: ${currentStep}`);
      return;
    }

    // Check if response contains expected keywords
    const responseText = response.toLowerCase();
    const hasExpectedKeywords = step.expectedKeywords?.some(keyword => 
      responseText.includes(keyword.toLowerCase())
    ) ?? true;

    const keywordInfo = `Step ${currentStep} - Keywords: ${step.expectedKeywords?.join(', ')} Found: ${hasExpectedKeywords}`;
    addDebugInfo(keywordInfo);

    const result: TestResult = {
      step: currentStep,
      question: step.question,
      answer: step.answer,
      response: response,
      success: hasExpectedKeywords,
      timestamp: new Date()
    };

    setResults(prev => [...prev, result]);

    // Continue to next step if not paused and not at the end
    if (!isPaused && isRunning && currentStep < testSteps.length) {
      const scheduleInfo = `Scheduling next step in ${speed}ms`;
      addDebugInfo(scheduleInfo);
      setTimeout(() => {
        continueToNextStep();
      }, speed);
    } else if (currentStep >= testSteps.length && isRunning) {
      // Test completed, send webhook
      addDebugInfo('✅ Test completed, sending webhook');
      setTimeout(() => {
        sendFinalWebhook();
      }, 1000);
    } else {
      addDebugInfo(`Not continuing - paused: ${isPaused}, running: ${isRunning}, step: ${currentStep}`);
    }
  };

  const continueToNextStep = async () => {
    if (isPaused) {
      addDebugInfo('⏸️ Test paused, stopping progression');
      setIsRunning(false);
      return;
    }
    
    if (currentStep >= testSteps.length) {
      addDebugInfo('🏁 All steps completed, sending final webhook');
      setIsRunning(false);
      setTimeout(() => {
        sendFinalWebhook();
      }, 1000);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    const step = testSteps[nextStep - 1];
    if (step) {
      const stepInfo = `➡️ Step ${nextStep}: ${step.question}`;
      addDebugInfo(stepInfo);
      try {
        setWaitingForResponse(true);
        addDebugInfo(`📤 Sending: "${step.answer}"`);
        await send(step.answer);
      } catch (error) {
        const errorInfo = `❌ Error at step ${nextStep}: ${error}`;
        addDebugInfo(errorInfo);
        const result: TestResult = {
          step: nextStep,
          question: step.question,
          answer: step.answer,
          response: '',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        };
        setResults(prev => [...prev, result]);
        setWaitingForResponse(false);
        
        // Continue even if there's an error
        if (!isPaused) {
          setTimeout(() => {
            continueToNextStep();
          }, speed * 2); // Double the delay after an error
        }
      }
    } else {
      addDebugInfo('🏁 No more steps, test complete');
      setIsRunning(false);
    }
  };

  const sendFinalWebhook = async () => {
    addDebugInfo(`📡 Sending final webhook with ${history.length} messages`);
    try {
      const webhookPayload = {
        message: "Test complet automatisé",
        response: history[history.length - 1]?.content || "Test terminé",
        timestamp: new Date().toISOString(),
        conversationId: `automated_test_${Date.now()}`,
        fullHistory: history,
        email: "test@example.com",
        emailDealerSubject: generateDealerEmailSubject(history, language),
        emailDealerBody: generateDealerEmailBody(history, language)
      };

      await sendToMakeWebhook(webhookPayload);
      setWebhookResult({ success: true });
      setIsRunning(false);
    } catch (error) {
      addDebugInfo(`❌ Webhook error: ${error}`);
      setWebhookResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown webhook error' 
      });
      setIsRunning(false);
    }
  };

  const runFullTest = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);
    setResults([]);
    setWebhookResult(null);
    setWaitingForResponse(false);
    setLastAssistantMessageIndex(-1);
    setDebugInfo([]); // Clear debug info
    
    // Reset the chat
    restart();
    
    // Wait a moment for the chat to reset, then start
    setTimeout(() => {
      setCurrentStep(1);
      addDebugInfo('🚀 Starting test with first step');
      const firstStep = testSteps[0];
      if (firstStep) {
        addDebugInfo(`📤 First message: "${firstStep.answer}"`);
        setWaitingForResponse(true);
        send(firstStep.answer).catch(error => {
          addDebugInfo(`❌ Error sending first message: ${error}`);
          setWaitingForResponse(false);
          setIsRunning(false);
        });
      }
    }, 1000);
  };

  const pauseTest = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetTest = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setResults([]);
    setWebhookResult(null);
    setWaitingForResponse(false);
    setLastAssistantMessageIndex(-1);
    setDebugInfo([]); // Clear debug info
    restart();
  };

  const handleLanguageChange = (newLanguage: Language) => {
    if (!isRunning) {
      switchLanguage(newLanguage);
    }
  };

  const successCount = results.filter(r => r.success).length;
  const totalSteps = results.length;

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Automated Chat Test Suite
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Complete end-to-end testing using the REAL chat interface - simulates a user going through all 11 questions and triggering the webhook.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h2>
              
              {/* Status */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isRunning ? 'bg-green-500 animate-pulse' : 
                    isPaused ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-medium">
                    {isRunning ? (waitingForResponse ? 'Waiting for Sam...' : 'Running') : 
                     isPaused ? 'Paused' : 'Ready'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Step {currentStep} of {testSteps.length} (12 Questions)
                  {totalSteps > 0 && (
                    <span className="ml-2">
                      ({successCount}/{totalSteps} passed)
                    </span>
                  )}
                  {waitingForResponse && (
                    <div className="text-xs text-blue-600 mt-1">
                      ⏳ Waiting for Sam's response...
                    </div>
                  )}
                </div>
              </div>
              
              {/* Debug Information */}
              <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-800 mb-2">
                  <span className="text-sm font-medium">Debug Log</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1 max-h-24 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="font-mono">
                      {info}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / testSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / testSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed (ms between steps)
                </label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={1000}>Fast (1s)</option>
                  <option value={2000}>Normal (2s)</option>
                  <option value={3000}>Slow (3s)</option>
                  <option value={5000}>Very Slow (5s)</option>
                </select>
              </div>

              {/* Control Buttons */}
              <div className="space-y-2">
                <button
                  onClick={runFullTest}
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Play size={20} />
                  Start Full Test
                </button>

                <button
                  onClick={pauseTest}
                  disabled={!isRunning}
                  className="w-full px-3 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Pause size={20} />
                  Pause Test
                </button>

                <button
                  onClick={resetTest}
                  disabled={isRunning}
                  className="w-full px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={20} />
                  Reset Test
                </button>
              </div>

              {/* Webhook Status */}
              {webhookResult && (
                <div className={`mt-4 p-3 rounded-lg ${
                  webhookResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {webhookResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      webhookResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Webhook {webhookResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {webhookResult.error && (
                    <p className="text-sm text-red-700 mt-1">{webhookResult.error}</p>
                  )}
                </div>
              )}

              {/* Real Chat History Count */}
              <div className="mt-4 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <MessageCircle size={16} />
                  <span className="text-sm font-medium">
                    Real Chat Messages: {history.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-green-600 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Test Results</h2>
                <p className="text-green-100 mt-1">
                  Real-time results from the actual chat interface
                </p>
              </div>

              <div className="p-4">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No test results yet. Click "Start Full Test" to begin.</p>
                    <p className="text-sm mt-2">This will use the real chat interface!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          result.success 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className="font-medium">
                              Step {result.step}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-blue-600">User:</span>
                            <span className="ml-2 text-sm">{result.answer}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">Sam:</span>
                            <div className="ml-2 mt-1 p-1 bg-white rounded border text-xs max-h-16 overflow-y-auto">
                              {result.response || result.error}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={resultsEndRef} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Chat History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-blue-600 px-4 py-3">
                <h2 className="text-lg font-semibold text-white">Live Chat History</h2>
                <p className="text-blue-100 mt-1 text-sm">
                  Real messages from Sam chat
                </p>
              </div>

              <div className="p-3">
                {history.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No chat history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-lg text-xs ${
                          msg.role === 'user' 
                            ? 'bg-blue-50 border-l-2 border-blue-500' 
                            : 'bg-gray-50 border-l-2 border-gray-500'
                        }`}
                      >
                        <div className="font-medium mb-1">
                          {msg.role === 'user' ? 'User' : 'Sam'}:
                        </div>
                        <div className="text-gray-700 max-h-12 overflow-y-auto">
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}