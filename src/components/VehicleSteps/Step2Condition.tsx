import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { Car, Sparkles } from 'lucide-react';

export function Step2Condition() {
  const { formData, updateField } = useVehicleFormState();

  const conditions = [
    {
      value: 'Neuf',
      label: 'Neuf',
      icon: Sparkles,
      description: 'Véhicule neuf directement du concessionnaire',
      color: 'from-green-500 to-emerald-600'
    },
    {
      value: 'Usagé',
      label: 'Usagé',
      icon: Car,
      description: 'Véhicule d\'occasion avec historique',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const handleConditionSelect = (condition: string) => {
    updateField('condition', condition);
  };

  return (
    <StepLayout
      currentStep={2}
      totalSteps={10}
      title="Neuf ou usagé ?"
      description="Préférez-vous un véhicule neuf ou d'occasion ?"
      canProceed={!!formData.condition}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {conditions.map((condition) => {
          const Icon = condition.icon;
          const isSelected = formData.condition === condition.value;
          
          return (
            <button
              key={condition.value}
              onClick={() => handleConditionSelect(condition.value)}
              className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-xl'
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${condition.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{condition.label}</h3>
                  <p className="text-sm text-gray-600">{condition.description}</p>
                </div>
              </div>
              
              {isSelected && (
                <div className="flex items-center gap-2 text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sélectionné</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {formData.condition && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-900">Condition sélectionnée:</span>
            <span className="text-blue-700 font-bold">{formData.condition}</span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-xl max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-900 mb-2">💡 À savoir</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Neuf:</strong> Garantie complète, dernières technologies, aucun historique</p>
          <p><strong>Usagé:</strong> Prix plus avantageux, dépréciation déjà absorbée, plus de choix</p>
        </div>
      </div>
    </StepLayout>
  );
}