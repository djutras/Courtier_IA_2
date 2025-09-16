import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { Building2, Users, TrendingUp } from 'lucide-react';

export function Step5Dealerships() {
  const { formData, updateField } = useVehicleFormState();

  const dealershipOptions = [
    { value: '3', label: '3 concessionnaires', icon: Building2, description: 'Comparaison rapide', color: 'from-green-500 to-emerald-600' },
    { value: '5', label: '5 concessionnaires', icon: Users, description: 'Bon équilibre', color: 'from-blue-500 to-indigo-600' },
    { value: '10', label: '10 concessionnaires', icon: TrendingUp, description: 'Plus de choix', color: 'from-purple-500 to-violet-600' },
    { value: '20', label: '20 concessionnaires', icon: TrendingUp, description: 'Maximum d\'options', color: 'from-orange-500 to-red-600' }
  ];

  const handleDealershipSelect = (count: string) => {
    updateField('dealerships', count);
  };

  const handleCustomInput = (value: string) => {
    // Only allow numbers between 1 and 100
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      updateField('dealerships', value);
    } else if (value === '') {
      updateField('dealerships', '');
    }
  };

  return (
    <StepLayout
      currentStep={5}
      totalSteps={10}
      title="Combien de concessionnaires dois-je contacter ?"
      description="Plus de concessionnaires = plus d'options et de concurrence pour le meilleur prix"
      canProceed={!!formData.dealerships && parseInt(formData.dealerships) >= 1}
    >
      <div className="space-y-6">
        {/* Quick selection buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dealershipOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.dealerships === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleDealershipSelect(option.value)}
                className={`p-4 border-2 rounded-2xl transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-xl'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${option.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
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

        {/* Custom input */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ou entrez un nombre personnalisé (1-100) :
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.dealerships}
            onChange={(e) => handleCustomInput(e.target.value)}
            placeholder="Entrez le nombre de concessionnaires..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selected count display */}
        {formData.dealerships && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">Nombre sélectionné:</span>
              <span className="text-blue-700 font-bold">{formData.dealerships} concessionnaires</span>
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-2">💡 Recommandation</h3>
          <div className="text-sm text-green-800 space-y-2">
            <p><strong>3-5 concessionnaires:</strong> Idéal pour une recherche rapide</p>
            <p><strong>5-10 concessionnaires:</strong> Bon équilibre entre choix et rapidité</p>
            <p><strong>10+ concessionnaires:</strong> Maximum de concurrence = meilleurs prix</p>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}