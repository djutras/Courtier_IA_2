import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Chat } from './components/Chat';
import { Inscription } from './components/Inscription';
import { WebhookTest } from './components/WebhookTest';
import { AutomatedChatTest } from './components/AutomatedChatTest';
import { VehicleForm } from './components/VehicleForm';
import { AutoTestForm } from './components/AutoTestForm';
import { Step1Brand } from './components/VehicleSteps/Step1Brand';
import { Step2Condition } from './components/VehicleSteps/Step2Condition';
import { Step3Model } from './components/VehicleSteps/Step3Model';
import { Step4Trim } from './components/VehicleSteps/Step4Trim';
import { Step5Dealerships } from './components/VehicleSteps/Step5Dealerships';
import { Step6Contact } from './components/VehicleSteps/Step6Contact';
import { Step7Name } from './components/VehicleSteps/Step7Name';
import { Step8Contact } from './components/VehicleSteps/Step8Contact';
import { Step9City } from './components/VehicleSteps/Step9City';
import { Step10Privacy } from './components/VehicleSteps/Step10Privacy';
import StepSummary from './components/VehicleSteps/StepSummary';
import { StepSuccess } from './components/VehicleSteps/StepSuccess';
import { HowItWorks } from './components/HowItWorks';
import { Privacy } from './components/Privacy';
import { Contact } from './components/Contact';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/vehicle-form" element={<VehicleForm />} />
          <Route path="/webhook-test" element={<WebhookTest />} />
          <Route path="/automated-test" element={<AutomatedChatTest />} />
          <Route path="/auto-test-form" element={<AutoTestForm />} />
          
          {/* Step-by-step Vehicle Form Routes */}
          <Route path="/vehicle-step/1" element={<Step1Brand />} />
          <Route path="/vehicle-step/2" element={<Step2Condition />} />
          <Route path="/vehicle-step/3" element={<Step3Model />} />
          <Route path="/vehicle-step/4" element={<Step4Trim />} />
          <Route path="/vehicle-step/5" element={<Step5Dealerships />} />
          <Route path="/vehicle-step/6" element={<Step6Contact />} />
          <Route path="/vehicle-step/7" element={<Step7Name />} />
          <Route path="/vehicle-step/8" element={<Step8Contact />} />
          <Route path="/vehicle-step/9" element={<Step9City />} />
          <Route path="/vehicle-step/10" element={<Step10Privacy />} />
          <Route path="/vehicle-step/11" element={<StepSummary />} />
          <Route path="/vehicle-step/success" element={<StepSuccess />} />
          
          {/* Bilingual Routes */}
          <Route path="/en/how-it-works" element={<HowItWorks />} />
          <Route path="/fr/fonctionnement" element={<HowItWorks />} />
          <Route path="/en/privacy" element={<Privacy />} />
          <Route path="/fr/confidentialite" element={<Privacy />} />
          <Route path="/en/contact" element={<Contact />} />
          <Route path="/fr/contact" element={<Contact />} />
          
          {/* Redirects for legacy routes */}
          <Route path="/contact" element={<Navigate to="/en/contact" replace />} />
          <Route path="/privacy" element={<Navigate to="/en/privacy" replace />} />
          <Route path="/how-it-works" element={<Navigate to="/en/how-it-works" replace />} />
          
          {/* Redirect old vehicle form to step 1 */}
          <Route path="/vehicle-form-steps" element={<Navigate to="/vehicle-step/1" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;