import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, TestTube, Zap } from 'lucide-react';
import { sendToMakeWebhook, WebhookPayload } from '../services/webhook';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

export function WebhookTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [response, setResponse] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('basic');

  const testScenarios = {
    basic: {
      name: 'Basic Test',
      description: 'Simple webhook test with minimal data',
      payload: {
        message: 'Test message from webhook test page',
        response: 'This is a test response from Sam AI',
        timestamp: new Date().toISOString(),
        conversationId: `test_${Date.now()}`,
        email: 'test@example.com'
      }
    },
    fullConversation: {
      name: 'Full Conversation',
      description: 'Complete vehicle inquiry conversation',
      payload: {
        message: 'Toyota Camry neuf',
        response: '📋 **RÉCAPITULATIF** (Question 2/17 complétées)\n✅ Marque : Toyota\n✅ Neuf/Usagé : ---\n\nNeuf ou usagé ? (N/U)',
        timestamp: new Date().toISOString(),
        conversationId: `full_test_${Date.now()}`,
        fullHistory: [
          { role: 'user', content: 'Toyota' },
          { role: 'assistant', content: 'Parfait! Toyota est un excellent choix. Neuf ou usagé ? (N/U)' },
          { role: 'user', content: 'Neuf' },
          { role: 'assistant', content: 'Quel modèle Toyota exactement ?' },
          { role: 'user', content: 'Camry' }
        ],
        email: 'client.test@example.com',
        emailDealerSubject: 'Demande urgente de soumission véhicule - Toyota Camry 2025 - Client prêt à acheter',
        emailDealerBody: '<html><body><h1>Test dealer email body</h1><p>This is a test email for Toyota Camry inquiry.</p></body></html>'
      }
    },
    errorTest: {
      name: 'Error Handling Test',
      description: 'Test with invalid webhook URL to test error handling',
      payload: {
        message: 'Error test message',
        response: 'This should trigger an error',
        timestamp: new Date().toISOString(),
        conversationId: `error_test_${Date.now()}`,
        email: 'error@test.com'
      },
      forceError: true
    }
  };

  const handleTest = async () => {
    setIsLoading(true);
    setStatus('idle');
    setResponse('');

    try {
      const scenario = testScenarios[selectedTest as keyof typeof testScenarios];
      
      if (scenario.forceError) {
        // Temporarily use invalid URL to test error handling
        const originalUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
        // This will cause an error
        await fetch('https://invalid-webhook-url.com/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scenario.payload)
        });
      } else {
        await sendToMakeWebhook(scenario.payload as WebhookPayload);
      }
      
      setStatus('success');
      setResponse('Webhook sent successfully! Check your Make.com scenario for the received data.');
    } catch (error) {
      console.error('Test error:', error);
      setStatus('error');
      setResponse(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectTest = async () => {
    setIsLoading(true);
    setStatus('idle');
    setResponse('');

    try {
      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
      
      if (!webhookUrl) {
        throw new Error('VITE_MAKE_WEBHOOK_URL not found in environment variables');
      }

      const testPayload = {
        test: true,
        message: 'Direct webhook test',
        timestamp: new Date().toISOString(),
        source: 'webhook-test-page'
      };

      console.log('Sending direct test to:', webhookUrl);
      console.log('Test payload:', testPayload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      const responseText = await response.text();
      
      console.log('Direct test response status:', response.status);
      console.log('Direct test response:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${responseText}`);
      }

      setStatus('success');
      setResponse(`Success! Status: ${response.status}\nResponse: ${responseText}`);
    } catch (error) {
      console.error('Direct test error:', error);
      setStatus('error');
      setResponse(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <TestTube className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Webhook Test Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Test your Make.com webhook integration with various scenarios to ensure everything is working correctly.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Webhook Testing
            </h2>
            <p className="text-blue-100 mt-2">
              Choose a test scenario and send it to your Make.com webhook
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Environment Check */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Environment Check</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Webhook URL:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    import.meta.env.VITE_MAKE_WEBHOOK_URL 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {import.meta.env.VITE_MAKE_WEBHOOK_URL ? '✓ Configured' : '✗ Missing'}
                  </span>
                </div>
                {import.meta.env.VITE_MAKE_WEBHOOK_URL && (
                  <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border">
                    {import.meta.env.VITE_MAKE_WEBHOOK_URL}
                  </div>
                )}
              </div>
            </div>

            {/* Test Scenario Selection */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Select Test Scenario</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(testScenarios).map(([key, scenario]) => (
                  <div
                    key={key}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTest === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTest(key)}
                  >
                    <h4 className="font-medium text-gray-900 text-sm">{scenario.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Scenario Preview */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Selected Scenario Preview</h3>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-32 overflow-y-auto">
                {JSON.stringify(testScenarios[selectedTest as keyof typeof testScenarios].payload, null, 2)}
              </pre>
            </div>

            {/* Test Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTest}
                disabled={isLoading || !import.meta.env.VITE_MAKE_WEBHOOK_URL}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                Run Selected Test
              </button>

              <button
                onClick={handleDirectTest}
                disabled={isLoading || !import.meta.env.VITE_MAKE_WEBHOOK_URL}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Zap size={20} />
                )}
                Direct Connection Test
              </button>
            </div>

            {/* Results */}
            {status !== 'idle' && (
              <div className={`p-3 rounded-lg border ${
                status === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`font-semibold ${
                    status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {status === 'success' ? 'Test Successful!' : 'Test Failed'}
                  </h3>
                </div>
                <div className={`text-sm ${
                  status === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  <pre className="whitespace-pre-wrap font-mono bg-white p-2 rounded border text-xs max-h-32 overflow-y-auto">
                    {response}
                  </pre>
                </div>
              </div>
            )}

            {/* Instructions */}
           <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Make sure your VITE_MAKE_WEBHOOK_URL is configured in the .env file</li>
                <li>Select a test scenario from the options above</li>
                <li>Click "Run Selected Test" to send the webhook</li>
                <li>Check your Make.com scenario to see if the data was received</li>
                <li>Use "Direct Connection Test" for basic connectivity testing</li>
                <li>Check the browser console (F12) for detailed logs</li>
              </ol>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}