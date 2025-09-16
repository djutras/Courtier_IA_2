import React from 'react';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { Mail, Phone, Shield, CheckCircle } from 'lucide-react';

export function Step8Contact() {
  const { formData, updateField } = useVehicleFormState();

  const handleEmailChange = (email: string) => {
    const phone = formData.emailPhone.split(' et ')[1] || '';
    const newValue = phone ? `${email} et ${phone}` : email;
    updateField('emailPhone', newValue);
  };

  const handlePhoneChange = (phone: string) => {
    const email = formData.emailPhone.split(' et ')[0] || '';
    const newValue = email ? `${email} et ${phone}` : phone;
    updateField('emailPhone', newValue);
  };

  const getEmail = () => formData.emailPhone.split(' et ')[0] || '';
  const getPhone = () => formData.emailPhone.split(' et ')[1] || '';

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const email = getEmail();
  const phone = getPhone();
  const isEmailValid = email && isValidEmail(email);
  const isPhoneValid = phone && isValidPhone(phone);
  const canProceed = isEmailValid && isPhoneValid;

  return (
    <StepLayout
      currentStep={8}
      totalSteps={10}
      title="Vos coordonnées"
      description="Votre meilleur courriel et numéro de téléphone pour recevoir les offres"
      canProceed={canProceed}
    >
      <div className="space-y-6">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Adresse courriel *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="votre@email.com"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors text-lg ${
                  email && !isEmailValid 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                autoComplete="email"
              />
              {email && !isEmailValid && (
                <p className="text-sm text-red-600 mt-1">Veuillez entrer une adresse email valide</p>
              )}
              {isEmailValid && (
                <div className="flex items-center gap-2 text-green-600 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Email valide</span>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(514) 123-4567"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors text-lg ${
                  phone && !isPhoneValid 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                autoComplete="tel"
              />
              {phone && !isPhoneValid && (
                <p className="text-sm text-red-600 mt-1">Veuillez entrer un numéro de téléphone valide</p>
              )}
              {isPhoneValid && (
                <div className="flex items-center gap-2 text-green-600 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Téléphone valide</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact summary */}
        {canProceed && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">📞 Vos coordonnées</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">{phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Security and usage info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Protection</h4>
            </div>
            <p className="text-sm text-green-800">
              Vos coordonnées sont protégées et ne seront jamais vendues à des tiers.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Utilisation</h4>
            </div>
            <p className="text-sm text-blue-800">
              Uniquement pour vous envoyer les meilleures offres de véhicules.
            </p>
          </div>
        </div>

        {/* Contact method reminder */}
        {formData.contact && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-2xl mx-auto">
            <h4 className="font-semibold text-yellow-900 mb-2">📱 Rappel</h4>
            <p className="text-sm text-yellow-800">
              Vous avez choisi d'être contacté par : <strong>{formData.contact}</strong>
            </p>
          </div>
        )}
      </div>
    </StepLayout>
  );
}