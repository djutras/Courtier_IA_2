import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { Shield, Eye, UserCheck, MessageCircle } from 'lucide-react';

export function Step10Privacy() {
  const { formData, updateField } = useVehicleFormState();

  const privacyOptions = [
    {
      value: 'A) Partager mes infos avec les concessionnaires gagnants seulement',
      label: 'Partage avec gagnants seulement',
      shortLabel: 'Option A',
      icon: UserCheck,
      description: 'Vos informations sont partagées uniquement avec les concessionnaires qui offrent les meilleures conditions',
      color: 'from-green-500 to-emerald-600',
      pros: [
        'Contact direct avec les meilleurs concessionnaires',
        'Négociation plus rapide et efficace',
        'Moins d\'intermédiaires dans le processus'
      ],
      cons: [
        'Possibilité de recevoir plusieurs appels',
        'Gestion directe des négociations'
      ]
    },
    {
      value: 'B) Ne pas partager - Sam relaie tout',
      label: 'Sam gère tout',
      shortLabel: 'Option B',
      icon: MessageCircle,
      description: 'Sam reste votre intermédiaire unique et gère toutes les communications avec les concessionnaires',
      color: 'from-blue-500 to-indigo-600',
      pros: [
        'Confidentialité maximale de vos informations',
        'Sam négocie en votre nom',
        'Aucun contact direct non sollicité',
        'Processus entièrement géré'
      ],
      cons: [
        'Processus potentiellement plus long',
        'Communication indirecte avec les concessionnaires'
      ]
    }
  ];

  const handlePrivacySelect = (option: string) => {
    updateField('privacy', option);
  };

  return (
    <StepLayout
      currentStep={10}
      totalSteps={10}
      title="Niveau de confidentialité"
      description="Choisissez comment vous souhaitez que vos informations soient gérées"
      canProceed={!!formData.privacy}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.privacy === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handlePrivacySelect(option.value)}
                className={`p-6 border-2 rounded-2xl transition-all duration-300 text-left h-full ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-xl'
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 hover:transform hover:scale-102'
                }`}
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${option.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{option.shortLabel}</h3>
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800">{option.label}</h4>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                  
                  {/* Pros */}
                  <div className="flex-1">
                    <h5 className="font-medium text-green-900 mb-2">✅ Avantages :</h5>
                    <ul className="text-sm text-green-800 space-y-1 mb-4">
                      {option.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Cons */}
                    <h5 className="font-medium text-orange-900 mb-2">⚠️ Considérations :</h5>
                    <ul className="text-sm text-orange-800 space-y-1">
                      {option.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {isSelected && (
                    <div className="flex items-center gap-2 text-blue-700 mt-4 pt-4 border-t border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Option sélectionnée</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected option display */}
        {formData.privacy && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Niveau de confidentialité choisi:</span>
            </div>
            <p className="text-blue-700 font-semibold">
              {formData.privacy.startsWith('A') ? 'Option A - Partage avec gagnants seulement' : 'Option B - Sam gère tout'}
            </p>
          </div>
        )}

        {/* Security guarantee */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-600 p-2 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-green-900">Garantie de sécurité</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Vos données ne sont jamais vendues</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Chiffrement de niveau bancaire</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Conformité RGPD et lois québécoises</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Contrôle total sur vos préférences</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Notre recommandation</h4>
          <p className="text-sm text-yellow-800">
            <strong>Option A</strong> est recommandée si vous voulez des résultats rapides et n'avez pas peur des contacts directs.
            <br />
            <strong>Option B</strong> est idéale si vous préférez la discrétion et laisser Sam gérer toutes les négociations.
          </p>
        </div>
      </div>
    </StepLayout>
  );
}