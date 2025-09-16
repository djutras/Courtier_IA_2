import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Car, Home } from 'lucide-react';
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

interface StepLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  canProceed?: boolean;
  isLastStep?: boolean;
}

export function StepLayout({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrevious,
  canProceed = true,
  isLastStep = false
}: StepLayoutProps) {
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (!isLastStep) {
      navigate(`/vehicle-step/${currentStep + 1}`);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (currentStep > 1) {
      navigate(`/vehicle-step/${currentStep - 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-3 rounded-full">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
            Formulaire de Véhicule
          </h1>
          <p className="text-gray-600">
            Étape {currentStep} sur {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-blue-100">{description}</p>
          </div>

          <div className="p-8">
            {children}
          </div>

          {/* Navigation */}
          <div className="px-8 pb-8">
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300"
                  >
                    <ArrowLeft size={20} />
                    Précédent
                  </button>
                ) : (
                  <Link
                    to="/vehicle-form"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300"
                  >
                    <Home size={20} />
                    Accueil
                  </Link>
                )}
              </div>

              <div>
                {isLastStep ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    Soumettre
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white rounded-xl hover:from-blue-700 hover:via-indigo-800 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Suivant
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}