import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepLayout } from './StepLayout';
import { useVehicleFormState } from '../../hooks/useVehicleFormState';
import { sendToMakeWebhook } from '../../services/webhook';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function StepSummary() {
  const navigate = useNavigate();
  const { formData, resetForm } = useVehicleFormState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Generate email content directly from form data - FOOLPROOF METHOD
      const year = new Date().getFullYear();
      const vehicleDescription = `${year} ${formData.brand || 'Véhicule'} ${formData.model || ''}`.trim();
      
      const emailSubject = `Demande urgente de soumission véhicule - ${vehicleDescription} - Client prêt à acheter`;
      
      // Extract email and phone from combined field
      const emailPhoneParts = (formData.emailPhone || '').split(' et ');
      const email = emailPhoneParts[0]?.trim() || 'Non spécifié';
      const phone = emailPhoneParts[1]?.trim() || 'Non spécifié';
      
      const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Demande de soumission véhicule</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;'>
        <h1 style='margin: 0; font-size: 24px;'>🚗 DEMANDE URGENTE DE SOUMISSION</h1>
        <p style='margin: 10px 0 0 0; font-size: 16px;'>Client prêt à acheter dans les 48 heures</p>
    </div>
    
    <div style='background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;'>
        <p style='font-size: 16px; margin-bottom: 20px;'><strong>Cher directeur des ventes,</strong></p>
        
        <p>Je suis <strong>Sam, Courtier Auto IA</strong>, représentant un acheteur qualifié qui magasine activement pour un véhicule et prêt à prendre une décision d'achat dans les prochaines <strong>48 heures</strong>.</p>
        
        <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
            <h3 style='color: #007bff; margin-top: 0;'>📋 EXIGENCES DU CLIENT</h3>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Véhicule:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${vehicleDescription}${formData.trim ? ` ${formData.trim}` : ''}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>État:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.condition || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Concessionnaires à contacter:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.dealerships || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Ville:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.city || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Niveau de confidentialité:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.privacy?.startsWith('A') ? 'Partager mes infos avec les concessionnaires gagnants seulement' : 'Ne pas partager - Sam relaie tout'}</td>
                </tr>
            </table>
        </div>
        
        <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
            <h3 style='color: #007bff; margin-top: 0;'>📞 COORDONNÉES DU CLIENT</h3>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Nom du client:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.name || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Courriel:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${email}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Téléphone:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${phone}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Méthode de contact préférée:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.contact || 'Non spécifié'}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Nombre de concessionnaires contactés:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.dealerships || 'Non spécifié'} concessionnaires</td>
                </tr>
            </table>
        </div>
        
        <h3 style='color: #28a745;'>💰 CE DONT NOUS AVONS BESOIN:</h3>
        <ul style='background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;'>
            <li><strong>Meilleur prix tout inclus</strong> (taxes, frais, livraison inclus)</li>
            <li><strong>Évaluation de reprise</strong> pour leur véhicule actuel</li>
            <li><strong>Conditions de financement</strong> disponibles</li>
            <li><strong>Confirmation de disponibilité</strong> immédiate</li>
            <li><strong>Promotions ou incitatifs</strong> actuels</li>
        </ul>
        
        <p>Merci pour votre attention rapide à cette demande.</p>
        
        <p><strong>Meilleures salutations,</strong><br>
        <strong>Sam, Courtier Auto IA</strong><br>
        📧 Système automatisé d'approvisionnement de véhicules<br>
        🤖 Propulsé par la technologie IA</p>
    </div>
</body>
</html>`;
      
      console.log('📧 Generated Email Subject:', emailSubject);
      console.log('📧 Generated Email Body Length:', emailBody.length);
      console.log('📧 Form Data Used:', formData);
      console.log('📧 Email extracted:', email);
      console.log('📧 Phone extracted:', phone);

      const webhookPayload = {
        message: `Step-by-step form submission from ${formData.name}`,
        response: `Vehicle request: ${formData.brand} ${formData.model} (${formData.condition})`,
        timestamp: new Date().toISOString(),
        conversationId: `step_form_${Date.now()}`,
        email: email,
        fullHistory: [
          { role: 'user', content: `Form Data: ${JSON.stringify(formData)}` },
          { role: 'assistant', content: 'Step-by-step form completed successfully' }
        ],
        emailDealerSubject: emailSubject,
        emailDealerBody: emailBody,
        formType: 'step-by-step-vehicle-form',
        vehicleData: formData
      };

      console.log('🚀 Sending webhook payload with email body length:', webhookPayload.emailDealerBody.length);

      await sendToMakeWebhook(webhookPayload);
      setSubmitStatus('success');
      
      // Reset form and redirect after success
      setTimeout(() => {
        resetForm();
        navigate('/vehicle-step/success');
      }, 2000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryItems = [
    { label: 'Marque', value: formData.brand },
    { label: 'État', value: formData.condition },
    { label: 'Modèle', value: formData.model },
    { label: 'Finition', value: formData.trim },
    { label: 'Concessionnaires', value: formData.dealerships },
    { label: 'Contact', value: formData.contact },
    { label: 'Nom', value: formData.name },
    { label: 'Courriel/Téléphone', value: formData.emailPhone },
    { label: 'Ville', value: formData.city },
    { label: 'Confidentialité', value: formData.privacy }
  ];

  return (
    <StepLayout
      currentStep={11}
      totalSteps={11}
      title="Vérifiez Vos Informations"
      description="Confirmez que toutes les informations sont correctes avant de soumettre"
      canProceed={true}
      isLastStep={true}
      onNext={handleSubmit}
    >
      <div className="space-y-6">
        {/* Summary Grid */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif de votre demande</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaryItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-700">{item.label}:</span>
                <span className="text-gray-900 font-semibold text-right max-w-[60%]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Votre véhicule</h3>
          <p className="text-2xl font-bold text-blue-700">
            {formData.brand} {formData.model} {formData.trim} ({formData.condition})
          </p>
          <p className="text-blue-600 mt-2">
            {formData.dealerships} concessionnaires seront contactés à {formData.city}
          </p>
        </div>

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Demande soumise avec succès!</p>
              <p className="text-green-700 text-sm">Sam contactera les concessionnaires pour vous.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Erreur lors de la soumission</p>
              <p className="text-red-700 text-sm">Veuillez réessayer ou contacter le support.</p>
            </div>
          </div>
        )}

        {/* Custom Submit Button */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                Soumission en cours...
              </>
            ) : (
              <>
                <Send size={24} />
                Soumettre ma demande
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h4 className="font-medium text-yellow-900 mb-2">🚀 Prochaines étapes</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Sam analysera vos exigences</li>
            <li>• Les concessionnaires seront contactés automatiquement</li>
            <li>• Vous recevrez les meilleures offres dans les 24-48 heures</li>
            <li>• Aucune action requise de votre part!</li>
          </ul>
        </div>
      </div>
    </StepLayout>
  );
}