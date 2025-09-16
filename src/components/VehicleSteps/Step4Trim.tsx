import React, { useState } from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { getTrimsForModel, hasTrimsForModel, getSuggestedTrims } from '../../data/carModels';
import { AlertCircle, Plus, HelpCircle } from 'lucide-react';

export function Step4Trim() {
  const { formData, updateField } = useVehicleFormState();
  const [customTrim, setCustomTrim] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const hasTrims = formData.brand && formData.model ? hasTrimsForModel(formData.brand, formData.model) : false;
  const trims = formData.brand && formData.model ? 
    (hasTrims ? getTrimsForModel(formData.brand, formData.model) : getSuggestedTrims(formData.brand, formData.model)) : [];

  const handleTrimSelect = (trim: string) => {
    updateField('trim', trim);
    setShowCustomInput(false);
  };

  const handleCustomTrimSubmit = () => {
    if (customTrim.trim()) {
      updateField('trim', customTrim.trim());
      setCustomTrim('');
      setShowCustomInput(false);
    }
  };

  if (!formData.brand || !formData.model) {
    return (
      <StepLayout
        currentStep={4}
        totalSteps={10}
        title="Quel niveau de finition ou ensemble ?"
        description="Sélectionnez le niveau de finition souhaité"
        canProceed={false}
      >
        <div className="text-center py-12">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Marque et modèle requis
          </h3>
          <p className="text-gray-600 mb-6">
            Veuillez d'abord sélectionner une marque et un modèle.
          </p>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      currentStep={4}
      totalSteps={10}
      title="Quel niveau de finition ou ensemble ?"
      description={`Choisissez la finition pour votre ${formData.brand} ${formData.model}`}
      canProceed={!!formData.trim}
    >
      <div className="space-y-6">
        {/* Status indicator */}
        <div className="mb-4">
          {hasTrims ? (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Données officielles disponibles pour {formData.brand} {formData.model}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Finitions suggérées pour {formData.brand} {formData.model}</span>
            </div>
          )}
        </div>

        {/* Trim selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {trims.map((trim) => (
            <button
              key={trim}
              onClick={() => handleTrimSelect(trim)}
              className={`p-3 text-sm font-medium border-2 rounded-xl transition-all duration-200 ${
                formData.trim === trim
                  ? 'bg-blue-600 text-white border-blue-600 transform scale-105 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
              }`}
            >
              {trim}
            </button>
          ))}
          
          <button
            onClick={() => setShowCustomInput(true)}
            className="p-3 text-sm font-medium border-2 border-dashed border-gray-400 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Autre
          </button>
        </div>

        {/* Custom input */}
        {showCustomInput && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrez la finition exacte :
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={customTrim}
                onChange={(e) => setCustomTrim(e.target.value)}
                placeholder="ex: Limited Edition"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomTrimSubmit()}
              />
              <button
                onClick={handleCustomTrimSubmit}
                disabled={!customTrim.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomTrim('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Selected trim display */}
        {formData.trim && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">Finition sélectionnée:</span>
              <span className="text-blue-700 font-bold">{formData.brand} {formData.model} {formData.trim}</span>
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600">
              {hasTrims ? (
                <p>Ces finitions sont officielles pour le {formData.brand} {formData.model}. Sélectionnez celle qui correspond à vos préférences ou choisissez "Autre" pour une finition personnalisée.</p>
              ) : (
                <p>Nous n'avons pas encore les données officielles pour le {formData.brand} {formData.model}, nous montrons donc des options suggérées. Vous pouvez aussi entrer une finition personnalisée.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}