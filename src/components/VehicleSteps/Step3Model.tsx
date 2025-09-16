import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { getModelsForMake } from '../../data/carModels';
import { AlertCircle } from 'lucide-react';

export function Step3Model() {
  const { formData, updateField } = useVehicleFormState();
  const [customModel, setCustomModel] = React.useState('');
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const models = formData.brand ? getModelsForMake(formData.brand) : [];

  const handleModelSelect = (model: string) => {
    updateField('model', model);
    // Clear trim when model changes
    updateField('trim', '');
    setShowCustomInput(false);
  };

  const handleCustomModelSubmit = () => {
    if (customModel.trim()) {
      updateField('model', customModel.trim());
      updateField('trim', '');
      setCustomModel('');
      setShowCustomInput(false);
    }
  };

  if (!formData.brand) {
    return (
      <StepLayout
        currentStep={3}
        totalSteps={10}
        title="Quel MODÈLE exactement ?"
        description="Sélectionnez le modèle spécifique que vous recherchez"
        canProceed={false}
      >
        <div className="text-center py-12">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Marque requise
          </h3>
          <p className="text-gray-600 mb-6">
            Veuillez d'abord sélectionner une marque à l'étape précédente.
          </p>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      currentStep={3}
      totalSteps={10}
      title="Quel MODÈLE exactement ?"
      description={`Sélectionnez le modèle ${formData.brand} que vous recherchez`}
      canProceed={!!formData.model}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => handleModelSelect(model)}
              className={`p-3 text-sm font-medium border-2 rounded-xl transition-all duration-200 ${
                formData.model === model
                  ? 'bg-blue-600 text-white border-blue-600 transform scale-105 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
              }`}
            >
              {model}
            </button>
          ))}
          
          <button
            onClick={() => setShowCustomInput(true)}
            className="p-3 text-sm font-medium border-2 border-dashed border-gray-400 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
          >
            + Autre modèle
          </button>
        </div>

        {showCustomInput && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrez le modèle exact :
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="ex: Camry Hybrid"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomModelSubmit()}
              />
              <button
                onClick={handleCustomModelSubmit}
                disabled={!customModel.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomModel('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {formData.model && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">Modèle sélectionné:</span>
              <span className="text-blue-700 font-bold">{formData.brand} {formData.model}</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Conseil</h3>
          <p className="text-sm text-gray-600">
            Si vous ne trouvez pas le modèle exact, utilisez "Autre modèle" pour l'ajouter manuellement.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}