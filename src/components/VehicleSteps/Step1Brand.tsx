import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { getAllMakes } from '../../data/carModels';

export function Step1Brand() {
  const { formData, updateField } = useVehicleFormState();
  const manufacturers = getAllMakes();

  const handleBrandSelect = (brand: string) => {
    updateField('brand', brand);
    // Clear dependent fields when brand changes
    updateField('model', '');
    updateField('trim', '');
  };

  return (
    <StepLayout
      currentStep={1}
      totalSteps={10}
      title="Quelle MARQUE recherchez-vous ?"
      description="Sélectionnez la marque du véhicule que vous souhaitez acheter"
      canProceed={!!formData.brand}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {manufacturers.map((manufacturer) => (
          <button
            key={manufacturer}
            onClick={() => handleBrandSelect(manufacturer)}
            className={`p-4 text-sm font-medium border-2 rounded-xl transition-all duration-200 ${
              formData.brand === manufacturer
                ? 'bg-blue-600 text-white border-blue-600 transform scale-105 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
            }`}
          >
            {manufacturer}
          </button>
        ))}
      </div>

      {formData.brand && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-900">Marque sélectionnée:</span>
            <span className="text-blue-700 font-bold">{formData.brand}</span>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Conseil</h3>
        <p className="text-sm text-gray-600">
          Choisissez la marque qui vous intéresse le plus. Vous pourrez explorer différents modèles à l'étape suivante.
        </p>
      </div>
    </StepLayout>
  );
}