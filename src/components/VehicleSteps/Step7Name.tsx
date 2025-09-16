import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { User, Shield, Eye } from 'lucide-react';

export function Step7Name() {
  const { formData, updateField } = useVehicleFormState();

  const handleNameChange = (value: string) => {
    updateField('name', value);
  };

  return (
    <StepLayout
      currentStep={7}
      totalSteps={10}
      title="Quel est votre nom svp ?"
      description="Votre nom nous aide à personnaliser les communications avec les concessionnaires"
      canProceed={!!formData.name && formData.name.trim().length >= 2}
    >
      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              <p className="text-sm text-gray-600">Sécurisées et confidentielles</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ex: Jean Dupont"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-lg"
                autoComplete="name"
              />
              {formData.name && formData.name.trim().length < 2 && (
                <p className="text-sm text-red-600 mt-1">Le nom doit contenir au moins 2 caractères</p>
              )}
            </div>
          </div>
        </div>

        {/* Selected name display */}
        {formData.name && formData.name.trim().length >= 2 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">Nom enregistré:</span>
              <span className="text-blue-700 font-bold">{formData.name}</span>
            </div>
          </div>
        )}

        {/* Privacy and security info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Sécurité</h4>
            </div>
            <p className="text-sm text-green-800">
              Vos informations sont chiffrées et protégées selon les normes de sécurité les plus strictes.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Confidentialité</h4>
            </div>
            <p className="text-sm text-blue-800">
              Votre nom est uniquement partagé avec les concessionnaires sélectionnés pour votre recherche.
            </p>
          </div>
        </div>

        {/* Why we need this info */}
        <div className="p-4 bg-gray-50 rounded-xl max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">🤝 Pourquoi nous avons besoin de votre nom</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Personnaliser les communications avec les concessionnaires
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Faciliter le processus de négociation en votre nom
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              Assurer un service client de qualité et personnalisé
            </li>
          </ul>
        </div>
      </div>
    </StepLayout>
  );
}