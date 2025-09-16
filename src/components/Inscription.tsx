import React, { useState } from 'react';
import { UserPlus, Mail, Phone, User, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { sendToMakeWebhook } from '../services/webhook';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  propertyType: string;
  estimatedValue: string;
  timeframe: string;
  additionalInfo: string;
}

export function Inscription() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    propertyType: '',
    estimatedValue: '',
    timeframe: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send to webhook
      const webhookPayload = {
        message: `Property evaluation request from ${formData.firstName} ${formData.lastName}`,
        response: `Property: ${formData.propertyType} in ${formData.city}\nEstimated Value: ${formData.estimatedValue}\nTimeframe: ${formData.timeframe}`,
        timestamp: new Date().toISOString(),
        conversationId: `property_eval_${Date.now()}`,
        email: formData.email,
        fullHistory: [
          { role: 'user', content: `Name: ${formData.firstName} ${formData.lastName}` },
          { role: 'user', content: `Email: ${formData.email}` },
          { role: 'user', content: `Phone: ${formData.phone}` },
          { role: 'user', content: `Address: ${formData.address}, ${formData.city}, ${formData.postalCode}` },
          { role: 'user', content: `Property Type: ${formData.propertyType}` },
          { role: 'user', content: `Estimated Value: ${formData.estimatedValue}` },
          { role: 'user', content: `Timeframe: ${formData.timeframe}` },
          { role: 'user', content: `Additional Info: ${formData.additionalInfo}` }
        ],
        formType: 'property-evaluation',
        propertyData: formData
      };

      await sendToMakeWebhook(webhookPayload);
      console.log('Property evaluation form sent to webhook successfully');
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          postalCode: '',
          propertyType: '',
          estimatedValue: '',
          timeframe: '',
          additionalInfo: ''
        });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Évaluation Gratuite de Votre Propriété
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Obtenez une évaluation professionnelle de votre propriété par un courtier immobilier qualifié. 
            Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">
              Informations de Contact
            </h2>
            <p className="text-blue-100 mt-2">
              Toutes les informations sont confidentielles et sécurisées
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Prénom *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-2" />
                  Nom de famille *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="Votre nom de famille"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Adresse courriel *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-2" />
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                  placeholder="(514) 123-4567"
                />
              </div>
            </div>

            {/* Property Information */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Informations sur la Propriété
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse de la propriété *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="123 Rue Principale"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                      placeholder="Montréal"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                      placeholder="H1A 1A1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de propriété *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      required
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="maison-unifamiliale">Maison unifamiliale</option>
                      <option value="condo">Condominium</option>
                      <option value="duplex">Duplex</option>
                      <option value="triplex">Triplex</option>
                      <option value="cottage">Cottage</option>
                      <option value="terrain">Terrain</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur estimée
                    </label>
                    <select
                      id="estimatedValue"
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    >
                      <option value="">Sélectionnez une fourchette</option>
                      <option value="moins-200k">Moins de 200 000$</option>
                      <option value="200k-300k">200 000$ - 300 000$</option>
                      <option value="300k-500k">300 000$ - 500 000$</option>
                      <option value="500k-750k">500 000$ - 750 000$</option>
                      <option value="750k-1m">750 000$ - 1 000 000$</option>
                      <option value="plus-1m">Plus de 1 000 000$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-2">
                    Délai souhaité pour la vente
                  </label>
                  <select
                    id="timeframe"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                  >
                    <option value="">Sélectionnez un délai</option>
                    <option value="immediat">Immédiatement</option>
                    <option value="1-3-mois">1-3 mois</option>
                    <option value="3-6-mois">3-6 mois</option>
                    <option value="6-12-mois">6-12 mois</option>
                    <option value="plus-12-mois">Plus de 12 mois</option>
                    <option value="exploration">Exploration seulement</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Informations supplémentaires
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    placeholder="Décrivez toute information pertinente sur votre propriété (rénovations récentes, particularités, etc.)"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-sm text-gray-600">
                  * Champs obligatoires. Vos informations sont protégées et confidentielles.
                </p>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Obtenir mon évaluation gratuite
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Demande envoyée avec succès!</p>
                    <p className="text-green-700 text-sm">Un courtier immobilier vous contactera sous peu.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Erreur lors de l'envoi</p>
                    <p className="text-red-700 text-sm">Veuillez réessayer ou nous contacter directement.</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Pourquoi choisir notre service d'évaluation?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">100% Gratuit</h4>
              <p className="text-gray-600 text-sm">Aucun frais, aucun engagement. Obtenez votre évaluation sans coût.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Courtiers Qualifiés</h4>
              <p className="text-gray-600 text-sm">Nos courtiers sont licenciés et expérimentés dans votre secteur.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Expertise Locale</h4>
              <p className="text-gray-600 text-sm">Connaissance approfondie du marché immobilier québécois.</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}