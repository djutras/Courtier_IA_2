import { VehicleFormData } from '../hooks/useVehicleFormState';

export function generateDirectDealerEmailSubject(formData: VehicleFormData): string {
  const vehicleDescription = `${formData.brand || 'Vehicle'} ${formData.model || ''}`.trim();
  const year = new Date().getFullYear();
  
  return `Demande urgente de soumission véhicule - ${vehicleDescription} ${year} - Client prêt à acheter`;
}

export function generateDirectDealerEmailBody(formData: VehicleFormData): string {
  const year = new Date().getFullYear();
  const vehicleDescription = `${year} ${formData.brand || 'Véhicule'} ${formData.model || ''}`.trim();
  
  // Extract email and phone from combined field
  const extractEmailAndPhone = (emailPhoneValue: string) => {
    if (!emailPhoneValue) return { email: 'Non spécifié', phone: 'Non spécifié' };
    
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,})/g;
    
    const emails = emailPhoneValue.match(emailPattern) || [];
    const phones = emailPhoneValue.match(phonePattern) || [];
    
    // If no valid patterns found, try to split by "et"
    if (emails.length === 0 && phones.length === 0) {
      const parts = emailPhoneValue.split(' et ').map(part => part.trim());
      if (parts.length >= 2) {
        return {
          email: parts[0] || 'Non spécifié',
          phone: parts[1] || 'Non spécifié'
        };
      } else {
        return {
          email: emailPhoneValue,
          phone: 'Non spécifié'
        };
      }
    }
    
    return {
      email: emails[0] || 'Non spécifié',
      phone: phones[0] || 'Non spécifié'
    };
  };
  
  const { email, phone } = extractEmailAndPhone(formData.emailPhone);
  
  // Helper function to get display value or fallback
  const getDisplayValue = (value: string | undefined, fallback: string = 'Non spécifié') => {
    if (!value || value.trim() === '' || value === '---') return fallback;
    return value.trim();
  };
  
  return `<!DOCTYPE html>
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
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.condition)}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Concessionnaires à contacter:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.dealerships)}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Ville:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.city)}</td>
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
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.name)}</td>
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
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.contact)}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Nombre de concessionnaires contactés:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(formData.dealerships)} concessionnaires</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Préférence de confidentialité:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${formData.privacy?.startsWith('A') ? 'Partager mes informations avec les concessionnaires gagnants seulement' : 'Ne pas partager mes informations - Sam relayera toutes les communications'}</td>
                </tr>
            </table>
        </div>
        
        <div style='background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <h3 style='color: #856404; margin-top: 0;'>⚡ DEMANDE URGENTE</h3>
            <p style='margin: 0; color: #856404;'>Ce client compare les offres de plusieurs concessionnaires et prendra une décision dans les <strong>48 heures</strong>. Veuillez fournir votre prix le plus compétitif pour sécuriser cette vente.</p>
        </div>
        
        <h3 style='color: #28a745;'>💰 CE DONT NOUS AVONS BESOIN:</h3>
        <ul style='background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;'>
            <li><strong>Meilleur prix tout inclus</strong> (taxes, frais, livraison inclus)</li>
            <li><strong>Évaluation de reprise</strong> pour leur véhicule actuel</li>
            <li><strong>Conditions de financement</strong> disponibles</li>
            <li><strong>Confirmation de disponibilité</strong> immédiate</li>
            <li><strong>Promotions ou incitatifs</strong> actuels</li>
        </ul>
        
        <div style='background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <h3 style='color: #0066cc; margin-top: 0;'>📞 PROCHAINES ÉTAPES</h3>
            <p style='margin: 0; color: #0066cc;'>Veuillez répondre avec votre meilleure offre dans les <strong>24 heures</strong>. Je présenterai toutes les offres compétitives à mon client et faciliterai la décision finale.</p>
        </div>
        
        <p>Merci pour votre attention rapide à cette demande.</p>
        
        <p><strong>Meilleures salutations,</strong><br>
        <strong>Sam, Courtier Auto IA</strong><br>
        📧 Système automatisé d'approvisionnement de véhicules<br>
        🤖 Propulsé par la technologie IA</p>
    </div>
    
    <div style='background: #6c757d; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;'>
        <p style='margin: 0;'>Ceci est un message automatisé généré par le système Sam Courtier Auto IA</p>
    </div>
</body>
</html>`;
}