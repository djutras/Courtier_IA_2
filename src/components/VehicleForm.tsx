import React, { useState } from 'react';
import { Car, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { sendToMakeWebhook } from '../services/webhook';
import { getModelsForMake, getTrimsForModel, hasTrimsForModel, getSuggestedTrims } from '../data/carModels';

interface FormData {
  brand: string;
  condition: string;
  model: string;
  trim: string;
  dealerships: string;
  contact: string;
  name: string;
  emailPhone: string;
  city: string;
  privacy: string;
}

const manufacturers = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW',
  'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'FIAT', 'Ford', 'Genesis',
  'GMC', 'Honda', 'Hyundai', 'INFINITI',
  'Jaguar', 'Jeep', 'Kia', 'Land Rover',
  'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz',
  'MINI', 'Mitsubishi', 'Nissan', 'Porsche',
  'Ram', 'Subaru', 'Toyota', 'Volkswagen',
  'Volvo'
];

const steps = [
  {
    title: "Marque du Véhicule",
    question: "Quelle MARQUE recherchez-vous ?",
    type: "buttons" as const
  },
  {
    title: "État",
    question: "Neuf ou usagé ?",
    type: "buttons" as const,
    options: ["Neuf", "Usagé"]
  },
  {
    title: "Modèle du Véhicule",
    question: "Quel MODÈLE exactement ?",
    type: "buttons" as const
  },
  {
    title: "Niveau de Finition",
    question: "Quel niveau de finition ou ensemble ?",
    placeholder: "Entrez le niveau de finition...",
    type: "text" as const
  },
  {
    title: "Concessionnaires",
    question: "Combien de concessionnaires dois-je contacter ? (recommandé: 3-100)",
    placeholder: "Entrez le nombre...",
    type: "number" as const
  },
  {
    title: "Méthode de Contact",
    question: "Comment préférez-vous être contacté ?",
    type: "buttons" as const,
    options: ["Courriel", "SMS", "Les deux"]
  },
  {
    title: "Votre Nom",
    question: "Quel est votre nom svp ?",
    placeholder: "Entrez votre nom complet...",
    type: "text" as const
  },
  {
    title: "Coordonnées",
    question: "Votre meilleur courriel et numéro de téléphone ?",
    placeholder: "courriel@exemple.com et 514-123-4567",
    type: "text" as const
  },
  {
    title: "Localisation",
    question: "Dans quelle ville résidez-vous ? (Pour vous jumeler avec les concessionnaires les plus près)",
    placeholder: "Entrez votre ville...",
    type: "dropdown" as const
  },
  {
    title: "Confidentialité",
    question: "Niveau de confidentialité :",
    type: "buttons" as const,
    options: [
      "A) Partager mes infos avec les concessionnaires gagnants seulement",
      "B) Ne pas partager - Sam relaie tout"
    ]
  }
];

const quebecCities = [
  "Montréal",
  "Québec",
  "Laval",
  "Gatineau",
  "Longueuil",
  "Sherbrooke",
  "Saguenay",
  "Lévis",
  "Trois-Rivières",
  "Terrebonne",
  "Saint-Jean-sur-Richelieu",
  "Repentigny",
  "Brossard",
  "Drummondville",
  "Saint-Jérôme",
  "Granby",
  "Blainville",
  "Saint-Hyacinthe",
  "Shawinigan",
  "Dollard-des-Ormeaux",
  "Joliette",
  "Victoriaville",
  "Rimouski",
  "Saint-Eustache",
  "Saint-Bruno-de-Montarville",
  "Mascouche",
  "Beloeil",
  "Châteauguay",
  "Saint-Constant",
  "Mirabel",
  "Chambly",
  "Saint-Lambert",
  "Boucherville",
  "Candiac",
  "Rouyn-Noranda",
  "Alma",
  "Sorel-Tracy",
  "Val-d'Or",
  "Sept-Îles",
  "Thetford Mines",
  "Sainte-Julie",
  "Vaudreuil-Dorion",
  "Chicoutimi",
  "Baie-Comeau",
  "Saint-Georges",
  "Sainte-Thérèse",
  "Jonquière",
  "Varennes",
  "Autre"
];

export function VehicleForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState<FormData>({
    brand: '',
    condition: '',
    model: '',
    trim: '',
    dealerships: '',
    contact: '',
    name: '',
    emailPhone: '',
    city: '',
    privacy: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show summary
      setCurrentStep(steps.length);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const webhookPayload = {
        message: `Vehicle form submission from ${formData.name}`,
        response: `Vehicle request: ${formData.brand} ${formData.model} (${formData.condition})`,
        timestamp: new Date().toISOString(),
        conversationId: `vehicle_form_${Date.now()}`,
        email: formData.emailPhone,
        fullHistory: [
          { role: 'user', content: `Brand: ${formData.brand}` },
          { role: 'user', content: `Condition: ${formData.condition}` },
          { role: 'user', content: `Model: ${formData.model}` },
          { role: 'user', content: `Trim: ${formData.trim}` },
          { role: 'user', content: `Dealerships: ${formData.dealerships}` },
          { role: 'user', content: `Contact: ${formData.contact}` },
          { role: 'user', content: `Name: ${formData.name}` },
          { role: 'user', content: `Email/Phone: ${formData.emailPhone}` },
          { role: 'user', content: `City: ${formData.city}` },
          { role: 'user', content: `Privacy: ${formData.privacy}` }
        ],
        formType: 'vehicle-consultation',
        vehicleData: formData
      };

      await sendToMakeWebhook(webhookPayload);
      setSubmitStatus('success');
      setShowThankYou(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      condition: '',
      model: '',
      trim: '',
      dealerships: '',
      contact: '',
      name: '',
      emailPhone: '',
      city: '',
      privacy: ''
    });
    setCurrentStep(0);
    setShowThankYou(false);
    setSubmitStatus('idle');
  };

  const getCurrentFieldValue = (): string => {
    const fieldMap: { [key: number]: keyof FormData } = {
      0: 'brand',
      1: 'condition',
      2: 'model',
      3: 'trim',
      4: 'dealerships',
      5: 'contact',
      6: 'name',
      7: 'emailPhone',
      8: 'city',
      9: 'privacy'
    };
    
    const field = fieldMap[currentStep];
    return field ? formData[field] : '';
  };

  const setCurrentFieldValue = (value: string) => {
    const fieldMap: { [key: number]: keyof FormData } = {
      0: 'brand',
      1: 'condition',
      2: 'model',
      3: 'trim',
      4: 'dealerships',
      5: 'contact',
      6: 'name',
      7: 'emailPhone',
      8: 'city',
      9: 'privacy'
    };
    
    const field = fieldMap[currentStep];
    if (field) {
      handleInputChange(field, value);
    }
  };

  const isStepValid = (): boolean => {
    const value = getCurrentFieldValue();
    if (currentStep === 7) {
      // Step 8 - Check both email and phone are filled
      const parts = value.split(' et ');
      return parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '';
    }
    return value.trim() !== '';
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navigation />
        
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-600 p-4 rounded-full">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Demande Soumise avec Succès !
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Sam IA analysera vos exigences et contactera les concessionnaires en votre nom. Vous recevrez les meilleures offres dans les 24-48 heures.
            </p>
            
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Nouvelle Demande
            </button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4 rounded-full">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent">
            Formulaire de Véhicule
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            Remplissez ce formulaire pour que Sam trouve les meilleures offres pour votre véhicule
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Étape {currentStep + 1} sur {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {currentStep < steps.length ? (
            // Regular Steps
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {steps[currentStep].question}
                </h2>
              </div>

              <div className="mb-8">
                {steps[currentStep].type === 'buttons' ? (
                  <div className={`gap-3 ${
                    currentStep === 1 
                     ? 'flex justify-center gap-3' 
                      : 'grid grid-cols-2 md:grid-cols-4'
                  }`}>
                    {currentStep === 0 ? (
                      // Manufacturer buttons
                      manufacturers.map((manufacturer) => (
                        <button
                          key={manufacturer}
                          onClick={() => setCurrentFieldValue(manufacturer)}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            getCurrentFieldValue() === manufacturer
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {manufacturer}
                        </button>
                      ))
                    ) : currentStep === 2 && formData.brand ? (
                      // Model buttons based on selected brand
                      getModelsForMake(formData.brand).map((model) => (
                        <button
                          key={model}
                          onClick={() => setCurrentFieldValue(model)}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            getCurrentFieldValue() === model
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {model}
                        </button>
                      ))
                    ) : (
                      // Other button options
                      steps[currentStep].options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => setCurrentFieldValue(option)}
                         className={`p-3 text-sm border rounded-lg transition-colors ${
                           currentStep === 1 ? 'min-w-[200px] text-xl font-medium border-2 rounded-xl shadow-lg' : ''
                         } ${
                            getCurrentFieldValue() === option
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))
                    )}
                  </div>
                ) : currentStep === 2 && !formData.brand ? (
                  // Show message if no brand selected for model step
                  <div className="text-center py-8 text-gray-500">
                    <Car size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Veuillez d'abord sélectionner une marque</p>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sélectionner la marque
                    </button>
                  </div>
                ) : currentStep === 4 ? (
                  // Step 5 - Dealership Count Selection
                  <div>
                    {/* Dealership count buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {['5', '10', '20', '50', '100'].map((count) => (
                        <button
                          key={count}
                          onClick={() => setCurrentFieldValue(count)}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            getCurrentFieldValue() === count
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    
                    {/* Manual input option */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Vous préférez un autre nombre ? Entrez-le manuellement :
                      </p>
                      <input
                        type="number"
                        value={getCurrentFieldValue()}
                        onChange={(e) => setCurrentFieldValue(e.target.value)}
                        placeholder="Entrez le nombre de concessionnaires..."
                        min="1"
                        max="100"
                        className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                ) : currentStep === 3 && formData.brand && formData.model ? (
                  // Step 4 - Trim Selection
                  <div>
                    {/* Trim buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {(hasTrimsForModel(formData.brand, formData.model) 
                        ? getTrimsForModel(formData.brand, formData.model)
                        : getSuggestedTrims(formData.brand, formData.model)
                      ).map((trim) => (
                        <button
                          key={trim}
                          onClick={() => setCurrentFieldValue(trim)}
                          className={`p-3 text-sm border rounded-lg transition-colors ${
                            getCurrentFieldValue() === trim
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          {trim}
                        </button>
                      ))}
                    </div>
                    
                    {/* Data source indicator */}
                    <div className="mb-4">
                      {hasTrimsForModel(formData.brand, formData.model) ? (
                        <div className="flex items-center gap-2 text-green-700 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Données officielles pour {formData.brand} {formData.model}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-700 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Finitions suggérées pour {formData.brand} {formData.model}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Manual input option */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Vous ne trouvez pas votre finition ? Entrez-la manuellement :
                      </p>
                      <input
                        type="text"
                        value={getCurrentFieldValue()}
                        onChange={(e) => setCurrentFieldValue(e.target.value)}
                        placeholder="Entrez la finition exactement..."
                        className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                ) : currentStep === 3 && (!formData.brand || !formData.model) ? (
                  // Show message if no brand/model selected for trim step
                  <div className="text-center py-8 text-gray-500">
                    <Car size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Veuillez d'abord sélectionner une marque et un modèle</p>
                    <div className="flex gap-4 justify-center mt-4">
                      {!formData.brand && (
                        <button
                          onClick={() => setCurrentStep(0)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Sélectionner la marque
                        </button>
                      )}
                      {formData.brand && !formData.model && (
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Sélectionner le modèle
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Regular text inputs for other steps
                  currentStep === 7 ? (
                    // Step 8 - Separate Email and Phone fields
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse courriel *
                        </label>
                        <input
                          type="email"
                          value={formData.emailPhone.split(' et ')[0] || ''}
                          onChange={(e) => {
                            const phone = formData.emailPhone.split(' et ')[1] || '';
                            const newValue = phone ? `${e.target.value} et ${phone}` : e.target.value;
                            setCurrentFieldValue(newValue);
                          }}
                          placeholder="votre@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone *
                        </label>
                        <input
                          type="tel"
                          value={formData.emailPhone.split(' et ')[1] || ''}
                          onChange={(e) => {
                            const email = formData.emailPhone.split(' et ')[0] || '';
                            const newValue = email ? `${email} et ${e.target.value}` : e.target.value;
                            setCurrentFieldValue(newValue);
                          }}
                          placeholder="(514) 123-4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                  ) : currentStep === 8 ? (
                    // Step 9 - City Dropdown
                    <div>
                      <select
                        value={getCurrentFieldValue()}
                        onChange={(e) => setCurrentFieldValue(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-lg bg-white"
                      >
                        <option value="">Sélectionnez votre ville</option>
                        {quebecCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    // Regular text inputs for other steps
                    <input
                      type={steps[currentStep].type}
                      value={getCurrentFieldValue()}
                      onChange={(e) => setCurrentFieldValue(e.target.value)}
                      placeholder={steps[currentStep].placeholder}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-lg"
                    />
                  )
                )}

                {/* Custom model input option for step 2 */}
                {currentStep === 2 && formData.brand && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Vous ne trouvez pas votre modèle ? Entrez-le manuellement :
                    </p>
                    <input
                      type="text"
                      value={getCurrentFieldValue()}
                      onChange={(e) => setCurrentFieldValue(e.target.value)}
                      placeholder="Entrez le modèle exactement..."
                      className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ArrowLeft size={20} />
                  Précédent
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white rounded-xl hover:from-blue-700 hover:via-indigo-800 hover:to-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Suivant
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            // Summary Step
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Vérifiez Vos Informations
                </h2>
                <p className="text-gray-600">
                  Veuillez vérifier vos informations avant de soumettre :
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Marque :</span>
                    <span className="text-gray-900">{formData.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">État :</span>
                    <span className="text-gray-900">{formData.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Modèle :</span>
                    <span className="text-gray-900">{formData.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Finition :</span>
                    <span className="text-gray-900">{formData.trim}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Concessionnaires :</span>
                    <span className="text-gray-900">{formData.dealerships}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Contact :</span>
                    <span className="text-gray-900">{formData.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Nom :</span>
                    <span className="text-gray-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Courriel/Téléphone :</span>
                    <span className="text-gray-900">{formData.emailPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Ville :</span>
                    <span className="text-gray-900">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Confidentialité :</span>
                    <span className="text-gray-900">{formData.privacy}</span>
                  </div>
                </div>
              </div>

              {/* Submit Status */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Échec de la soumission</p>
                    <p className="text-red-700 text-sm">Veuillez réessayer ou contacter le support.</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ArrowLeft size={20} />
                  Précédent
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Soumission...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Soumettre la Demande
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}