import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock, Zap, FileText } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { sendToMakeWebhook } from '../services/webhook';
import { Language } from '../services/openai';
import { generateDealerEmailSubject, generateDealerEmailBody } from '../utils/dealerEmail';

interface TestData {
  brand: string;
  condition: string;
  model: string;
  trim: string;
  dealerships: string;
  contact: string;
  name: string;
  emailPhone: string;
  city: string;
  privacy: string;
}

interface TestResult {
  step: number;
  field: string;
  value: string;
  success: boolean;
  timestamp: Date;
}

const testScenarios: { [key: string]: TestData } = {
  toyota: {
    brand: 'Toyota',
    condition: 'Neuf',
    model: 'Camry',
    trim: 'XLE',
    dealerships: '5',
    contact: 'Courriel',
    name: 'Jean Dupont',
    emailPhone: 'jean.dupont@email.com et 514-123-4567',
    city: 'Montréal',
    privacy: 'A) Partager mes infos avec les concessionnaires gagnants seulement'
  },
  honda: {
    brand: 'Honda',
    condition: 'Usagé',
    model: 'Civic',
    trim: 'Sport',
    dealerships: '10',
    contact: 'SMS',
    name: 'Marie Tremblay',
    emailPhone: 'marie.tremblay@gmail.com et 438-555-9876',
    city: 'Québec',
    privacy: 'B) Ne pas partager - Sam relaie tout'
  },
  ford: {
    brand: 'Ford',
    condition: 'Neuf',
    model: 'F-150',
    trim: 'Lariat',
    dealerships: '3',
    contact: 'Les deux',
    name: 'Pierre Leblanc',
    emailPhone: 'pierre.leblanc@hotmail.com et 450-777-1234',
    city: 'Laval',
    privacy: 'A) Partager mes infos avec les concessionnaires gagnants seulement'
  }
};

export function AutoTestForm() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('toyota');
  const [speed, setSpeed] = useState(1000);
  const [webhookResult, setWebhookResult] = useState<{ success: boolean; error?: string } | null>(null);

  const steps = [
    { field: 'brand', label: 'Marque' },
    { field: 'condition', label: 'État' },
    { field: 'model', label: 'Modèle' },
    { field: 'trim', label: 'Finition' },
    { field: 'dealerships', label: 'Concessionnaires' },
    { field: 'contact', label: 'Contact' },
    { field: 'name', label: 'Nom' },
    { field: 'emailPhone', label: 'Email/Téléphone' },
    { field: 'city', label: 'Ville' },
    { field: 'privacy', label: 'Confidentialité' }
  ];

  const fillFormField = (field: string, value: string) => {
    console.log(`Filling field: ${field} with value: ${value}`);
    // Simulate filling form fields
    const result: TestResult = {
      step: currentStep + 1,
      field: field,
      value: value,
      success: true,
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    console.log(`Field filled successfully: ${field}`);
    return true;
  };

  const runAutoTest = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setResults([]);
    setWebhookResult(null);

    const testData = testScenarios[selectedScenario];
    
    for (let i = 0; i < steps.length; i++) {
      // Check if we should continue (not paused)
      if (i > 0) {
        // Wait for the specified speed between steps
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setCurrentStep(i);
      const step = steps[i];
      const value = testData[step.field as keyof TestData];
      
      // Simulate form filling with success
      const success = fillFormField(step.label, value);
      
      if (!success) {
        console.error(`Failed to fill field: ${step.field}`);
        break;
      }
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, speed));
    await submitTestForm(testData);
    
    setIsRunning(false);
  };

  const submitTestForm = async (testData: TestData) => {
    try {
      // Create a realistic conversation history that matches the actual chat flow
      const mockHistory = [
        { role: 'user' as const, content: testData.brand },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 1/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ---\n\n---\n\nNeuf ou usagé ? (N/U)` },
        { role: 'user' as const, content: testData.condition },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 2/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ---\n\n---\n\nQuel MODÈLE exactement ?` },
        { role: 'user' as const, content: testData.model },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 3/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ---\n\n---\n\nQuel niveau de finition ou ensemble ?` },
        { role: 'user' as const, content: testData.trim },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 4/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ---\n\n---\n\nCombien de concessionnaires dois-je contacter ? (recommandé: 3-100)` },
        { role: 'user' as const, content: testData.dealerships },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 5/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ---\n\n---\n\nComment préférez-vous être contacté ? Courriel / SMS / Les deux` },
        { role: 'user' as const, content: testData.contact },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 6/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ${testData.contact}\n✅ Nom : ---\n\n---\n\nQuel est votre nom svp ?` },
        { role: 'user' as const, content: testData.name },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 7/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ${testData.contact}\n✅ Nom : ${testData.name}\n✅ Email/Téléphone : ---\n\n---\n\nVotre meilleur courriel et numéro de téléphone ?` },
        { role: 'user' as const, content: testData.emailPhone },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 8/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ${testData.contact}\n✅ Nom : ${testData.name}\n✅ Email/Téléphone : ${testData.emailPhone}\n✅ Ville : ---\n\n---\n\nDans quelle ville résidez-vous ? (Pour vous jumeler avec les concessionnaires les plus près)` },
        { role: 'user' as const, content: testData.city },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 9/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ${testData.contact}\n✅ Nom : ${testData.name}\n✅ Email/Téléphone : ${testData.emailPhone}\n✅ Ville : ${testData.city}\n✅ Confidentialité : ---\n\n---\n\nNiveau de confidentialité :\nA) Partager mes infos avec les concessionnaires gagnants seulement\nB) Ne pas partager - Sam relaie tout` },
        { role: 'user' as const, content: testData.privacy },
        { role: 'assistant' as const, content: `📋 **RÉCAPITULATIF** (Question 10/10 complétées)\n✅ Marque : ${testData.brand}\n✅ Neuf/Usagé : ${testData.condition}\n✅ Modèle : ${testData.model}\n✅ Finition : ${testData.trim}\n✅ Nb concessionnaires : ${testData.dealerships}\n✅ Contact préféré : ${testData.contact}\n✅ Nom : ${testData.name}\n✅ Email/Téléphone : ${testData.emailPhone}\n✅ Ville : ${testData.city}\n✅ Confidentialité : ${testData.privacy}\n\n---\n\nVoici votre profil complet :\n\n- Marque : ${testData.brand}\n- Neuf ou usagé : ${testData.condition}\n- Modèle : ${testData.model}\n- Finition/Ensemble : ${testData.trim}\n- Nombre de concessionnaires : ${testData.dealerships}\n- Contact préféré : ${testData.contact}\n- Nom : ${testData.name}\n- Email/Téléphone : ${testData.emailPhone}\n- Ville : ${testData.city}\n- Confidentialité : ${testData.privacy}\n\nEst-ce exact ? (O/N)` },
        { role: 'user' as const, content: 'Oui' },
        { role: 'assistant' as const, content: 'Parfait ! Je mets la pression sur les concessionnaires et je reviens vite. 🚀' }
      ];

      const language: Language = 'fr';
      
      const webhookPayload = {
        message: `Auto test form submission - ${testData.brand} ${testData.model}`,
        response: `Vehicle request: ${testData.brand} ${testData.model} (${testData.condition})`,
        timestamp: new Date().toISOString(),
        conversationId: `auto_test_form_${Date.now()}`,
        email: testData.emailPhone.split(' et ')[0] || testData.emailPhone,
        fullHistory: mockHistory,
        emailDealerSubject: generateDealerEmailSubject(mockHistory, language),
        emailDealerBody: generateDealerEmailBody(mockHistory, language),
        formType: 'auto-test-vehicle-form',
        vehicleData: testData
      };

      await sendToMakeWebhook(webhookPayload);
      setWebhookResult({ success: true });
    } catch (error) {
      setWebhookResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const pauseTest = () => {
    if (isRunning) {
      setIsRunning(false);
      console.log('Auto test paused');
    }
  };

  const resetTest = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setResults([]);
    setWebhookResult(null);
  };

  const successCount = results.filter(r => r.success).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 p-4 rounded-full">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
            Auto Test Form
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            Automated testing for the vehicle form - fills out all fields automatically and submits to webhook
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Controls</h2>
              
              {/* Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-medium">
                    {isRunning ? 'Running Test...' : 'Ready'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                  {results.length > 0 && (
                    <span className="ml-2">
                      ({successCount}/{results.length} completed)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Test Scenario Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Scenario
                </label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="toyota">Toyota Camry (Neuf)</option>
                  <option value="honda">Honda Civic (Usagé)</option>
                  <option value="ford">Ford F-150 (Neuf)</option>
                </select>
              </div>

              {/* Speed Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed (ms between steps)
                </label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  disabled={isRunning}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={500}>Very Fast (0.5s)</option>
                  <option value={1000}>Fast (1s)</option>
                  <option value={2000}>Normal (2s)</option>
                  <option value={3000}>Slow (3s)</option>
                </select>
              </div>

              {/* Control Buttons */}
              <div className="space-y-3">
                <button
                  onClick={runAutoTest}
                  disabled={isRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Start Auto Test
                </button>

                <button
                  onClick={pauseTest}
                  disabled={!isRunning}
                  className="w-full px-4 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Pause size={20} />
                  Pause Test
                </button>

                <button
                  onClick={resetTest}
                  disabled={isRunning}
                  className="w-full px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Reset Test
                </button>
              </div>

              {/* Webhook Status */}
              {webhookResult && (
                <div className={`mt-6 p-4 rounded-lg ${
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
            </div>
          </div>

          {/* Test Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Test Results</h2>
                <p className="text-purple-100 mt-1">Form field completion status</p>
              </div>

              <div className="p-6">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No test results yet</p>
                    <p className="text-sm mt-2">Click "Start Auto Test" to begin</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          result.success 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-medium text-sm">
                              {result.field}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Step {result.step}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 ml-6">
                          {result.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Data Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Test Data Preview</h2>
                <p className="text-blue-100 mt-1">Current scenario data</p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {Object.entries(testScenarios[selectedScenario]).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="font-medium text-gray-700 capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900 text-sm text-right max-w-[60%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automatically fills all form fields</li>
                    <li>• Simulates user interaction timing</li>
                    <li>• Submits form data to webhook</li>
                    <li>• Tracks success/failure of each step</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}