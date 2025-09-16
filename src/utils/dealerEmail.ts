import { Language } from '../services/openai';

type Message = { role: "user" | "assistant"; content: string };

interface VehicleProfile {
  brand?: string;
  newUsed?: string;
  model?: string;
  trim?: string;
  powertrain?: string;
  drivetrain?: string;
  options?: string;
  color?: string;
  payment?: string;
  termBudget?: string;
  tradeIn?: string;
  tradeInDetails?: string;
  dealerships?: string;
  contact?: string;
  emailPhone?: string;
  city?: string;
  privacy?: string;
}

interface ConversationFlow {
  questionPositions: Map<string, number>;
  userResponses: Map<string, string>;
}

function extractVehicleProfile(history: Message[]): VehicleProfile {
  console.log('🔍 Starting ENHANCED extraction with history length:', history.length);
  console.log('📝 Full history:', history);
  
  let profile: VehicleProfile = {};
  
  // STRATEGY 0: Direct Sequential Extraction (Highest Priority)
  const extractFromSequentialFlow = (): boolean => {
    console.log('🎯 STRATEGY 0: Direct Sequential Extraction');
    
    // Get all user messages in order
    const userMessages = history.filter(msg => msg.role === 'user').map(msg => msg.content.trim());
    console.log('👤 Sequential user messages:', userMessages);
    console.log('📊 Total user messages count:', userMessages.length);
    
    // NEW SIMPLIFIED FLOW MAPPING (10 questions total)
    if (userMessages.length >= 1) profile.brand = userMessages[0]; // Question 1: Brand
    if (userMessages.length >= 2) {
      const answer = userMessages[1].toLowerCase();
      profile.newUsed = answer === 'n' ? 'Neuf' : answer === 'u' ? 'Usagé' : userMessages[1];
    }
    if (userMessages.length >= 3) profile.model = userMessages[2]; // Question 3: Model
    if (userMessages.length >= 4) profile.trim = userMessages[3]; // Question 4: Trim
    if (userMessages.length >= 5) profile.dealerships = userMessages[4]; // Question 5: Dealerships
    if (userMessages.length >= 6) profile.contact = userMessages[5]; // Question 6: Contact preference
    if (userMessages.length >= 7) profile.name = userMessages[6]; // Question 7: Name
    if (userMessages.length >= 8) {
      // Question 8: Email/Phone - extract both email and phone from the response
      const emailPhoneResponse = userMessages[7];
      console.log('📧 Raw email/phone response:', emailPhoneResponse);
      profile.emailPhone = emailPhoneResponse; // Store the raw response for now
    }
    if (userMessages.length >= 9) profile.city = userMessages[8]; // Question 9: City
    if (userMessages.length >= 10) {
      // Question 10: Privacy
      const privacyAnswer = userMessages[9];
      profile.privacy = privacyAnswer;
    }
    
    console.log('✅ Sequential extraction completed for simplified flow');
    console.log('📋 Profile after sequential extraction:', profile);
    
    return Object.keys(profile).length > 5; // Return true if we extracted significant data
  };
  
  // STRATEGY 1: Complete Profile Extraction (Highest Priority)
  const extractFromCompleteProfile = (): boolean => {
    console.log('🎯 STRATEGY 1: Complete Profile Extraction');
    
    // Multiple patterns to find the complete profile
    const profilePatterns = [
      /Voici votre profil complet\s*:?\s*([\s\S]*?)(?=Est-ce exact|$)/i,
      /profil complet\s*:?\s*([\s\S]*?)(?=Est-ce exact|$)/i,
      /Here is your complete profile\s*:?\s*([\s\S]*?)(?=Is this correct|$)/i
    ];
    
    // Look for complete profile in assistant messages, starting from the end
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'assistant') {
        const content = history[i].content;
        
        // Check if this is the final completion message with 🚀
        if (content.includes('🚀') && (content.includes('Parfait ! Je mets la pression') || content.includes('Perfect! I\'m putting pressure'))) {
          console.log('🚀 Found completion message, looking for previous complete profile');
          
          // Look for the complete profile in previous messages
          for (let j = i - 1; j >= 0; j--) {
            if (history[j].role === 'assistant') {
              for (const pattern of profilePatterns) {
                const match = history[j].content.match(pattern);
                if (match) {
                  console.log('📋 Found complete profile from previous message:', match[1]);
                  extractProfileFields(match[1]);
                  return true;
                }
              }
            }
          }
        }
        
        // Also check current message for complete profile
        for (const pattern of profilePatterns) {
          const match = content.match(pattern);
          if (match) {
            console.log('📋 Found complete profile in current message:', match[1]);
            extractProfileFields(match[1]);
            return true;
          }
        }
      }
    }
    
    console.log('❌ No complete profile found');
    return false;
  };
  
  const extractProfileFields = (completeProfile: string) => {
    console.log('🔧 Extracting fields from complete profile');
    
    // Enhanced field extraction with multiple patterns per field
    const extractField = (fieldPatterns: string[], fallbackPatterns: string[] = []) => {
      const allPatterns = [...fieldPatterns, ...fallbackPatterns];
      
      for (const fieldName of allPatterns) {
        const regex = new RegExp(`-\\s*${fieldName}\\s*:?\\s*([^\\n\\r]+)`, 'i');
        const match = completeProfile.match(regex);
        if (match && match[1].trim() !== '---' && match[1].trim() !== 'N/A' && match[1].trim() !== '') {
          return match[1].trim();
        }
      }
      return null;
    };
    
    // Extract each field with multiple possible names
    profile.brand = extractField(['Marque', 'Brand']) || profile.brand;
    profile.newUsed = extractField(['Neuf ou usagé', 'New or used', 'Neuf/Usagé', 'New/Used']) || profile.newUsed;
    profile.model = extractField(['Modèle', 'Model']) || profile.model;
    profile.trim = extractField(['Finition/Ensemble', 'Trim/Package', 'Finition', 'Trim', 'Ensemble', 'Package']) || profile.trim;
    profile.powertrain = extractField(['Groupe motopropulseur', 'Powertrain', 'Motopropulseur']) || profile.powertrain;
    profile.drivetrain = extractField(['Transmission', 'Drivetrain']) || profile.drivetrain;
    profile.options = extractField(['Options indispensables', 'Essential options', 'Options']) || profile.options;
    profile.color = extractField(['Couleurs préférées', 'Preferred colors', 'Couleurs', 'Colors', 'Couleur']) || profile.color;
    profile.payment = extractField(['Plan de paiement', 'Payment plan', 'Paiement', 'Payment']) || profile.payment;
    profile.termBudget = extractField(['Durée/Budget mensuel', 'Term/Monthly budget', 'Durée/Budget', 'Term/Budget']) || profile.termBudget;
    profile.tradeIn = extractField(['Véhicule à échanger', 'Trade-in vehicle', 'Échange', 'Trade-in']) || profile.tradeIn;
    profile.tradeInDetails = extractField(['Détails véhicule échange', 'Trade-in details', 'Détails échange']) || profile.tradeInDetails;
    profile.dealerships = extractField(['Nombre de concessionnaires', 'Number of dealerships', 'Nb concessionnaires', 'Concessionnaires']) || profile.dealerships;
    profile.contact = extractField(['Contact préféré', 'Preferred contact', 'Contact']) || profile.contact;
    profile.emailPhone = extractField(['Courriel', 'Email', 'Téléphone', 'Phone']) || profile.emailPhone;
    profile.city = extractField(['Ville', 'City']) || profile.city;
    profile.privacy = extractField(['Confidentialité', 'Privacy']) || profile.privacy;
    
    console.log('📋 Extracted from complete profile:', profile);
  };
  
  // STRATEGY 2: Dynamic Conversation Flow Mapping
  const mapConversationFlow = (): ConversationFlow => {
    console.log('🎯 STRATEGY 2: Dynamic Conversation Flow Mapping');
    
    const questionPositions = new Map<string, number>();
    const userResponses = new Map<string, string>();
    
    for (let i = 0; i < history.length - 1; i++) {
      const question = history[i];
      const answer = history[i + 1];
      
      if (question.role === 'assistant' && answer.role === 'user') {
        const questionText = question.content.toLowerCase();
        const answerText = answer.content.trim();
        
        // Skip empty answers
        if (!answerText || answerText === '---') continue;
        
        // Map question types to their positions and answers
        if ((questionText.includes('marque') || questionText.includes('brand')) && !questionPositions.has('brand')) {
          questionPositions.set('brand', i);
          userResponses.set('brand', answerText);
        }
        if ((questionText.includes('neuf') || questionText.includes('usagé') || questionText.includes('new') || questionText.includes('used')) && !questionPositions.has('newUsed')) {
          questionPositions.set('newUsed', i);
          userResponses.set('newUsed', answerText);
        }
        if ((questionText.includes('modèle') || questionText.includes('model')) && !questionPositions.has('model')) {
          questionPositions.set('model', i);
          userResponses.set('model', answerText);
        }
        if ((questionText.includes('finition') || questionText.includes('trim') || questionText.includes('ensemble') || questionText.includes('niveau')) && !questionPositions.has('trim')) {
          questionPositions.set('trim', i);
          userResponses.set('trim', answerText);
        }
        if ((questionText.includes('motopropulseur') || questionText.includes('powertrain') || questionText.includes('groupe motopropulseur')) && !questionPositions.has('powertrain')) {
          questionPositions.set('powertrain', i);
          userResponses.set('powertrain', answerText);
        }
        if ((questionText.includes('transmission') || questionText.includes('drivetrain')) && !questionPositions.has('drivetrain')) {
          questionPositions.set('drivetrain', i);
          userResponses.set('drivetrain', answerText);
        }
        if (questionText.includes('options') && !questionPositions.has('options')) {
          questionPositions.set('options', i);
          userResponses.set('options', answerText);
        }
        if ((questionText.includes('couleur') || questionText.includes('color')) && !questionPositions.has('color')) {
          questionPositions.set('color', i);
          userResponses.set('color', answerText);
        }
        if ((questionText.includes('paiement') || questionText.includes('payment') || questionText.includes('plan de paiement')) && !questionPositions.has('payment')) {
          questionPositions.set('payment', i);
          userResponses.set('payment', answerText);
        }
        if ((questionText.includes('budget') || questionText.includes('durée') || questionText.includes('mois') || questionText.includes('term')) && !questionPositions.has('termBudget')) {
          questionPositions.set('termBudget', i);
          userResponses.set('termBudget', answerText);
        }
        if ((questionText.includes('échange') || questionText.includes('trade') || questionText.includes('échanger')) && !questionPositions.has('tradeIn')) {
          questionPositions.set('tradeIn', i);
          userResponses.set('tradeIn', answerText);
        }
        if ((questionText.includes('année') || questionText.includes('marque') || questionText.includes('kilométrage') || questionText.includes('vin')) && questionText.includes('véhicule') && !questionPositions.has('tradeInDetails')) {
          questionPositions.set('tradeInDetails', i);
          userResponses.set('tradeInDetails', answerText);
        }
        if ((questionText.includes('concessionnaires') || questionText.includes('dealerships') || questionText.includes('contacter')) && !questionPositions.has('dealerships')) {
          questionPositions.set('dealerships', i);
          userResponses.set('dealerships', answerText);
        }
        if ((questionText.includes('contacté') || questionText.includes('contact')) && questionText.includes('préférez') && !questionPositions.has('contact')) {
          questionPositions.set('contact', i);
          userResponses.set('contact', answerText);
        }
        if ((questionText.includes('courriel') || questionText.includes('email') || questionText.includes('téléphone') || questionText.includes('phone')) && !questionPositions.has('emailPhone')) {
          questionPositions.set('emailPhone', i);
          userResponses.set('emailPhone', answerText);
        }
        if ((questionText.includes('ville') || questionText.includes('city') || questionText.includes('résidez')) && !questionPositions.has('city')) {
          questionPositions.set('city', i);
          userResponses.set('city', answerText);
        }
      }
    }
    
    console.log('🗺️ Conversation flow mapped:', { questionPositions, userResponses });
    return { questionPositions, userResponses };
  };
  
  // STRATEGY 3: Smart Contact Field Processing
  const processContactFields = () => {
    console.log('🎯 STRATEGY 3: Smart Contact Field Processing');
    
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,})/g;
    
    const userMessages = history.filter(msg => msg.role === 'user');
    const emails: string[] = [];
    const phones: string[] = [];
    
    userMessages.forEach((msg, index) => {
      const content = msg.content;
      
      // Ensure content is a string
      const contentText = typeof content === 'string' ? content : String(content || '');
      
      // Extract emails
      const emailMatches = contentText.match(emailPattern);
      if (emailMatches) {
        emails.push(...emailMatches);
      }
      
      // Extract phones
      const phoneMatches = contentText.match(phonePattern);
      if (phoneMatches) {
        phones.push(...phoneMatches);
      }
    });
    
    // Also check if the 7th user message (email/phone question) contains contact info
    if (userMessages.length >= 8) {
      const emailPhoneResponse = userMessages[7]; // 8th message (0-indexed)
      
      // Ensure emailPhoneResponse is a string
      const responseText = typeof emailPhoneResponse === 'string' ? emailPhoneResponse : String(emailPhoneResponse || '');
      
      const emailMatches = responseText.match(emailPattern);
      const phoneMatches = responseText.match(phonePattern);
      
      if (emailMatches) {
        emails.push(...emailMatches.filter(email => !emails.includes(email)));
      }
      if (phoneMatches) {
        phones.push(...phoneMatches.filter(phone => !phones.includes(phone)));
      }
    }
    
    // Combine email and phone
    if (emails.length > 0 || phones.length > 0) {
      const combined = [...emails, ...phones].join(', ');
      profile.emailPhone = combined; // Always update with latest found
    }
    
    // Infer contact preference if not set
    if (!profile.contact && emails.length > 0) {
      profile.contact = 'Courriel';
    }
    
    console.log('📧 Contact fields processed:', { emails, phones, contact: profile.contact, emailPhone: profile.emailPhone });
  };
  
  // STRATEGY 4: Sequential User Message Extraction
  const extractFromUserSequence = () => {
    console.log('🎯 STRATEGY 4: Sequential User Message Extraction');
    
    const userMessages = history.filter(msg => msg.role === 'user').map(msg => msg.content.trim());
    console.log('👤 User messages sequence:', userMessages);
    
    // Map user responses to fields based on typical conversation flow
    // This is a fallback strategy with flexible positioning
    
    if (userMessages.length >= 1 && !profile.brand) {
      profile.brand = userMessages[0];
    }
    
    if (userMessages.length >= 2 && !profile.newUsed) {
      const answer = userMessages[1].toLowerCase();
      if (answer === 'n' || answer === 'neuf' || answer === 'new') {
        profile.newUsed = 'Neuf';
      } else if (answer === 'u' || answer === 'usagé' || answer === 'used') {
        profile.newUsed = 'Usagé';
      } else {
        profile.newUsed = userMessages[1];
      }
    }
    
    // Continue with flexible mapping for other fields
    let currentIndex = 2;
    const remainingFields = ['model', 'trim', 'powertrain', 'drivetrain', 'options', 'color', 'payment'];
    
    remainingFields.forEach(field => {
      if (currentIndex < userMessages.length && !profile[field as keyof VehicleProfile]) {
        (profile as any)[field] = userMessages[currentIndex];
        currentIndex++;
      }
    });
    
    console.log('👤 Extracted from user sequence:', profile);
  };
  
  // STRATEGY 5: Enhanced Validation and Cleaning
  const validateAndCleanProfile = (profile: VehicleProfile): VehicleProfile => {
    console.log('🎯 STRATEGY 5: Enhanced Validation and Cleaning');
    
    const cleanedProfile: VehicleProfile = {};
    
    Object.entries(profile).forEach(([key, value]) => {
      if (value && value.trim() !== '' && value !== '---' && value !== 'N/A') {
        let cleanedValue = value.trim();
        
        // Field-specific cleaning and validation
        switch (key) {
          case 'newUsed':
            if (cleanedValue === 'N') cleanedValue = 'Neuf';
            else if (cleanedValue === 'U') cleanedValue = 'Usagé';
            break;
            
          case 'tradeIn':
            if (cleanedValue === 'O' || cleanedValue.toLowerCase() === 'oui') cleanedValue = 'Oui';
            else if (cleanedValue === 'N' || cleanedValue.toLowerCase() === 'non') cleanedValue = 'Non';
            break;
            
          case 'contact':
            // Handle case where email was provided instead of contact preference
            if (cleanedValue.includes('@')) {
              if (!cleanedProfile.emailPhone) {
                cleanedProfile.emailPhone = cleanedValue;
              }
              cleanedValue = 'Courriel';
            }
            break;
            
          case 'emailPhone':
            // Ensure proper formatting of combined email/phone
            const emails = cleanedValue.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
            const phones = cleanedValue.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,})/g) || [];
            if (emails.length > 0 || phones.length > 0) {
              cleanedValue = [...emails, ...phones].join(', ');
            } else {
              // Keep original value if no patterns match
              cleanedValue = cleanedValue;
            }
            break;
        }
        
        if (cleanedValue) {
          cleanedProfile[key as keyof VehicleProfile] = cleanedValue;
        }
      }
    });
    
    // Final validation: ensure contact preference is set if email/phone exists
    if (cleanedProfile.emailPhone && !cleanedProfile.contact) {
      if (cleanedProfile.emailPhone.includes('@')) {
        cleanedProfile.contact = 'Courriel';
      }
    }
    
    console.log('✅ Final cleaned profile:', cleanedProfile);
    return cleanedProfile;
  };
  
  // EXECUTE ALL STRATEGIES IN ORDER
  console.log('🚀 Executing extraction strategies...');
  
  // Strategy 0: Direct sequential extraction (highest priority for automated tests)
  const sequentialSuccess = extractFromSequentialFlow();
  
  // Strategy 1: Complete Profile (highest priority)
  const completeProfileSuccess = extractFromCompleteProfile();
  
  // Strategy 2: Map conversation flow and extract missing fields
  const flow = mapConversationFlow();
  flow.userResponses.forEach((answer, field) => {
    if (!profile[field as keyof VehicleProfile]) {
      (profile as any)[field] = answer;
    }
  });
  
  // Strategy 3: Process contact fields
  processContactFields();
  
  // Strategy 4: Sequential extraction for any remaining gaps
  if (!sequentialSuccess) {
    extractFromUserSequence();
  }
  
  // Strategy 5: Final validation and cleaning
  const finalProfile = validateAndCleanProfile(profile);
  
  console.log('🎯 EXTRACTION COMPLETE - Final profile:', finalProfile);
  console.log('📊 Extraction success rate:', Object.keys(finalProfile).length, 'fields extracted');
  console.log('🔍 Sequential success:', sequentialSuccess, 'Complete profile success:', completeProfileSuccess);
  
  return finalProfile;
}

export function generateDealerEmailSubject(history: Message[], language: Language): string {
  const profile = extractVehicleProfile(history);
  
  const vehicleDescription = `${profile.brand || 'Vehicle'} ${profile.model || ''}`.trim();
  const year = new Date().getFullYear();
  
  if (language === 'en') {
    return `Urgent Vehicle Quote Request - ${vehicleDescription} ${year} - Client Ready to Purchase`;
  } else {
    return `Demande urgente de soumission véhicule - ${vehicleDescription} ${year} - Client prêt à acheter`;
  }
}

export function generateDealerEmailBody(history: Message[], language: Language): string {
  const profile = extractVehicleProfile(history);
  const year = new Date().getFullYear();
  
  if (language === 'en') {
    return generateEnglishEmailBody(profile, year);
  } else {
    return generateFrenchEmailBody(profile, year);
  }
}

function generateEnglishEmailBody(profile: VehicleProfile, year: number): string {
  const vehicleDescription = `${year} ${profile.brand || 'Vehicle'} ${profile.model || ''}`.trim();
  
  // Helper function to get display value or fallback
  const getDisplayValue = (value: string | undefined, fallback: string = 'Not specified') => {
    if (!value || value.trim() === '' || value === '---') return fallback;
    return value.trim();
  };
  
  // Extract email and phone from combined field
  const extractEmailAndPhone = (emailPhoneValue: string | undefined) => {
    console.log('🔍 Extracting from emailPhoneValue:', emailPhoneValue);
    
    if (!emailPhoneValue) return { email: 'Not specified', phone: 'Not specified' };
    
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,})/g;
    
    const emails = emailPhoneValue.match(emailPattern) || [];
    const phones = emailPhoneValue.match(phonePattern) || [];
    
    console.log('📧 Found emails:', emails);
    console.log('📱 Found phones:', phones);
    
    // If no valid email/phone patterns found, try to split by "et" and use parts
    if (emails.length === 0 && phones.length === 0) {
      const parts = emailPhoneValue.split(' et ').map(part => part.trim());
      console.log('🔄 Splitting by "et":', parts);
      
      if (parts.length >= 2) {
        return {
          email: parts[0] || 'Not specified',
          phone: parts[1] || 'Not specified'
        };
      } else {
        return {
          email: emailPhoneValue,
          phone: 'Not specified'
        };
      }
    }
    
    return {
      email: emails[0] || 'Not specified',
      phone: phones[0] || 'Not specified'
    };
  };
  
  const { email, phone } = extractEmailAndPhone(profile.emailPhone);
  
  // Map values with proper translations
  const displayValues = {
    condition: profile.newUsed === 'Neuf' ? 'New' : 
               profile.newUsed === 'Usagé' ? 'Used' : 
               profile.newUsed === 'New' ? 'New' :
               profile.newUsed === 'Used' ? 'Used' : 'New',
    powertrain: profile.powertrain === 'Hybride' ? 'Hybrid' :
                profile.powertrain === 'Électrique' ? 'Electric' :
                profile.powertrain === 'Essence' ? 'Gas' :
                getDisplayValue(profile.powertrain),
    drivetrain: profile.drivetrain === 'Traction avant' ? 'Front-wheel drive' :
               profile.drivetrain === 'Traction intégrale' ? 'All-wheel drive' :
               profile.drivetrain === 'Propulsion' ? 'Rear-wheel drive' :
               profile.drivetrain === 'Automatique' ? 'Automatic transmission' :
               getDisplayValue(profile.drivetrain),
    options: getDisplayValue(profile.options),
    color: getDisplayValue(profile.color),
    payment: profile.payment === 'Financement' ? 'Financing' : 
            profile.payment === 'Location' ? 'Lease' : 
            profile.payment === 'Comptant' ? 'Cash' :
            getDisplayValue(profile.payment),
    tradeIn: profile.tradeIn === 'Oui' ? 'Yes' : 
            profile.tradeIn === 'Non' ? 'No' :
            getDisplayValue(profile.tradeIn),
    contact: profile.contact === 'Courriel' ? 'Email' :
            profile.contact === 'SMS' ? 'SMS' :
            profile.contact === 'Les deux' ? 'Both email and SMS' :
            getDisplayValue(profile.contact)
  };
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Vehicle Quote Request</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;'>
        <h1 style='margin: 0; font-size: 24px;'>🚗 URGENT VEHICLE QUOTE REQUEST</h1>
        <p style='margin: 10px 0 0 0; font-size: 16px;'>Client Ready to Purchase Within 48 Hours</p>
    </div>
    
    <div style='background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;'>
        <p style='font-size: 16px; margin-bottom: 20px;'><strong>Dear Sales Manager,</strong></p>
        
        <p>I am <strong>Sam, AI Auto Broker</strong>, representing a qualified buyer who is actively shopping for a vehicle and ready to make a purchase decision within the next <strong>48 hours</strong>.</p>
        
        <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
            <h3 style='color: #007bff; margin-top: 0;'>📋 CLIENT REQUIREMENTS</h3>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Vehicle:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${vehicleDescription}${profile.trim ? ` ${profile.trim}` : ''}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Condition:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${displayValues.condition}</td>
                </tr>
                ${profile.dealerships ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Dealerships to Contact:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.dealerships)}</td>
                </tr>` : ''}
                ${profile.city ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>City:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.city)}</td>
                </tr>` : ''}
                ${profile.privacy ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Privacy Level:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${profile.privacy === 'A' ? 'Share info with winning dealers only' : 'Do not share - Sam relays everything'}</td>
                </tr>` : ''}
            </table>
        </div>
        
        <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
            <h3 style='color: #007bff; margin-top: 0;'>📞 CLIENT CONTACT INFORMATION</h3>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Email:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${email}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Phone:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${phone}</td>
                </tr>
                ${profile.contact ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Preferred Contact Method:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${displayValues.contact}</td>
                </tr>` : ''}
                ${profile.dealerships ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Number of Dealers Contacted:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.dealerships)} dealerships</td>
                </tr>` : ''}
                ${profile.privacy ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Privacy Preference:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${profile.privacy === 'A' ? 'Share my information with winning dealerships only' : 'Do not share my information - Sam will relay all communications'}</td>
                </tr>` : ''}
        
        <h3 style='color: #28a745;'>💰 WHAT WE NEED FROM YOU:</h3>
        <ul style='background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;'>
            <li><strong>Best all-in price</strong> (including taxes, fees, delivery)</li>
            <li><strong>Trade-in evaluation</strong> for their current vehicle</li>
            <li><strong>Financing terms</strong> available</li>
            <li><strong>Immediate availability</strong> confirmation</li>
            <li><strong>Any current promotions</strong> or incentives</li>
        </ul>
        
        <div style='background: #e7f3ff; border: 1px solid #b3d9ff; padding: 15px; border-radius: 8px; margin: 20px 0;'>
            <h3 style='color: #0066cc; margin-top: 0;'>📞 NEXT STEPS</h3>
            <p style='margin: 0; color: #0066cc;'>Please reply with your best offer within <strong>24 hours</strong>. I will present all competitive offers to my client and facilitate the final decision.</p>
        </div>
        
        <p>Thank you for your prompt attention to this request.</p>
        
        <p><strong>Best regards,</strong><br>
        <strong>Sam, AI Auto Broker</strong><br>
        📧 Automated Vehicle Procurement System<br>
        🤖 Powered by AI Technology</p>
    </div>
    
    <div style='background: #6c757d; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;'>
        <p style='margin: 0;'>This is an automated message generated by Sam AI Auto Broker system</p>
    </div>
</body>
</html>`;
}

function generateFrenchEmailBody(profile: VehicleProfile, year: number): string {
  const vehicleDescription = `${year} ${profile.brand || 'Véhicule'} ${profile.model || ''}`.trim();
  
  // Helper function to get display value or fallback
  const getDisplayValue = (value: string | undefined, fallback: string = 'Non spécifié') => {
    if (!value || value.trim() === '' || value === '---') return fallback;
    return value.trim();
  };
  
  // Extract email and phone from combined field
  const extractEmailAndPhone = (emailPhoneValue: string | undefined) => {
    console.log('🔍 Extracting from emailPhoneValue:', emailPhoneValue);
    
    if (!emailPhoneValue) return { email: 'Non spécifié', phone: 'Non spécifié' };
    
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phonePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10,})/g;
    
    const emails = emailPhoneValue.match(emailPattern) || [];
    const phones = emailPhoneValue.match(phonePattern) || [];
    
    console.log('📧 Found emails:', emails);
    console.log('📱 Found phones:', phones);
    
    // If no valid email/phone patterns found, try to split by "et" and use parts
    if (emails.length === 0 && phones.length === 0) {
      const parts = emailPhoneValue.split(' et ').map(part => part.trim());
      console.log('🔄 Splitting by "et":', parts);
      
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
  
  const { email, phone } = extractEmailAndPhone(profile.emailPhone);
  
  // Map values with proper translations
  const displayValues = {
    condition: profile.newUsed === 'New' ? 'Neuf' : 
               profile.newUsed === 'Used' ? 'Usagé' : 
               getDisplayValue(profile.newUsed, 'Neuf'),
    powertrain: profile.powertrain === 'Hybrid' ? 'Hybride' : 
                profile.powertrain === 'Electric' ? 'Électrique' : 
                profile.powertrain === 'Gas' ? 'Essence' :
                getDisplayValue(profile.powertrain),
    drivetrain: profile.drivetrain === 'Front-wheel drive' ? 'Traction avant' :
               profile.drivetrain === 'All-wheel drive' ? 'Traction intégrale' :
               profile.drivetrain === 'Rear-wheel drive' ? 'Propulsion' :
               profile.drivetrain === 'Automatic transmission' ? 'Transmission automatique' :
               getDisplayValue(profile.drivetrain),
    options: getDisplayValue(profile.options),
    color: getDisplayValue(profile.color),
    payment: profile.payment === 'Financing' ? 'Financement' : 
            profile.payment === 'Lease' ? 'Location' : 
            profile.payment === 'Cash' ? 'Comptant' :
            getDisplayValue(profile.payment),
    tradeIn: profile.tradeIn === 'Yes' ? 'Oui' : 
            profile.tradeIn === 'No' ? 'Non' :
            getDisplayValue(profile.tradeIn),
    contact: profile.contact === 'Email' ? 'Courriel' :
            profile.contact === 'SMS' ? 'SMS' :
            profile.contact === 'Both email and SMS' ? 'Courriel et SMS' :
            getDisplayValue(profile.contact)
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
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${vehicleDescription}${profile.trim ? ` ${profile.trim}` : ''}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>État:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${displayValues.condition}</td>
                </tr>
                ${profile.dealerships ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Concessionnaires à contacter:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.dealerships)}</td>
                </tr>` : ''}
                ${profile.city ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Ville:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.city)}</td>
                </tr>` : ''}
                ${profile.privacy ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Niveau de confidentialité:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${profile.privacy === 'A' ? 'Partager mes infos avec les concessionnaires gagnants seulement' : 'Ne pas partager - Sam relaie tout'}</td>
                </tr>` : ''}
            </table>
        </div>
        
        <div style='background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;'>
            <h3 style='color: #007bff; margin-top: 0;'>📞 COORDONNÉES DU CLIENT</h3>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;'>Nom du client:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.name)}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Courriel:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${email}</td>
                </tr>
                <tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Téléphone:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${phone}</td>
                </tr>
                ${profile.contact ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Méthode de contact préférée:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${displayValues.contact}</td>
                </tr>` : ''}
                ${profile.dealerships ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Nombre de concessionnaires contactés:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${getDisplayValue(profile.dealerships)} concessionnaires</td>
                </tr>` : ''}
                ${profile.privacy ? `<tr>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;'>Préférence de confidentialité:</td>
                    <td style='padding: 8px 0; border-bottom: 1px solid #eee;'>${profile.privacy === 'A' ? 'Partager mes informations avec les concessionnaires gagnants seulement' : 'Ne pas partager mes informations - Sam relayera toutes les communications'}</td>
                </tr>` : ''}
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