import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { Mail, MessageSquare, Phone } from 'lucide-react';

export function Step6Contact() {
  const { formData, updateField } = useVehicleFormState();

  const contactOptions = [
    {
      value: 'Courriel',
      label: 'Courriel',
      icon: Mail,
      description: 'Recevez les offres par email',
      color: 'from-blue-500 to-indigo-600',
      pros: ['Documentation écrite', 'Pièces jointes possibles', 'Pas de dérangement']
    },
    {
      value: 'SMS',
      label: 'SMS / Texto',
      icon: MessageSquare,
      description: 'Notifications rapides par texto',
      color: 'from-green-500 to-emerald-600',
      pros: ['Réponse immédiate', 'Pratique sur mobile', 'Notifications push']
    },
    {
      value: 'Les deux',
      label: 'Les deux',
      icon: Phone,
      description: 'Email + SMS pour ne rien manquer',
      color: 'from-purple-500 to-violet-600',
      pros: ['Couverture maximale', 'Flexibilité totale', 'Aucune offre manquée']
    }
  ];

  const handleContactSelect = (method: string) => {
    updateField('contact', method);
  };

  return (
    <StepLayout
      currentStep={6}
      totalSteps={10}
      title="Comment préférez-vous être contacté ?"
      description="Choisissez votre méthode de communication préférée pour recevoir les offres"
      canProceed={!!formData.contact}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.contact === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleContactSelect(option.value)}
                className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left h-full ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-xl'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${option.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Avantages :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {option.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {isSelected && (
                    <div className="flex items-center gap-2 text-blue-700 mt-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Sélectionné</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected method display */}
        {formData.contact && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-blue-900">Méthode sélectionnée:</span>
              <span className="text-blue-700 font-bold">{formData.contact}</span>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">📱 À savoir</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Courriel:</strong> Idéal pour recevoir des devis détaillés avec documents</p>
            <p><strong>SMS:</strong> Parfait pour des notifications rapides et urgentes</p>
            <p><strong>Les deux:</strong> Recommandé pour ne manquer aucune opportunité</p>
          </div>
        </div>
      </div>
    </StepLayout>
  );
}