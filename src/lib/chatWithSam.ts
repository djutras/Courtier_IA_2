import { sendMessageToOpenAI, Language } from '../services/openai';

type Message = { role: "user" | "assistant"; content: string };

const WELCOME_MESSAGES = {
  fr: "Bonjour! Prêt à me laisser dénicher la meilleure offre pour un véhicule ? Auto, VUS ou pick-up, je peux vous aider ! Quelle MARQUE recherchez-vous ?",
  en: "Hello! Ready to let me find the best deal for a vehicle? Car, SUV or pickup, I can help! What BRAND are you looking for?"
};

const BRAND_KEYWORDS = [
  'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'mazda', 'hyundai', 'kia', 
  'volkswagen', 'bmw', 'mercedes', 'audi', 'lexus', 'acura', 'infiniti', 'subaru', 
  'mitsubishi', 'jeep', 'ram', 'dodge', 'chrysler', 'cadillac', 'buick', 'gmc', 
  'lincoln', 'volvo', 'porsche', 'tesla', 'genesis'
];

export async function chatWithSam(history: Message[], language: Language = 'fr'): Promise<string> {
  // For the very first interaction, always start with the welcome message
  if (history.length === 1 && history[0].role === 'user') {
    // First user message should trigger the brand question with progress tracking
    const userMessage = history[0].content.toLowerCase();
    
    // If user already provided a brand name, acknowledge it and move to question 2
    const hasBrand = BRAND_KEYWORDS.some(brand => userMessage.includes(brand));
    
    if (hasBrand) {
      const brand = history[0].content;
      const summaryFormat = language === 'en' ? 
        `📋 **SUMMARY** (Question 1/17 completed)
✅ Brand: ${brand}
✅ New/Used: ---
✅ Model: ---
✅ Trim: ---
✅ Powertrain: ---
✅ Drivetrain: ---
✅ Options: ---
✅ Colors: ---
✅ Payment: ---
✅ Term/Budget: ---
✅ Trade-in: ---
✅ Trade-in details: ---
✅ # Dealerships: ---
✅ Preferred contact: ---
✅ Email/Phone: ---
✅ Privacy: ---

---

New or used? (N/U)` :
        `📋 **RÉCAPITULATIF** (Question 1/17 complétées)
✅ Marque : ${brand}
✅ Neuf/Usagé : ---
✅ Modèle : ---
✅ Finition : ---
✅ Motopropulseur : ---
✅ Transmission : ---
✅ Options : ---
✅ Couleurs : ---
✅ Paiement : ---
✅ Durée/Budget : ---
✅ Échange : ---
✅ Détails échange : ---
✅ Nb concessionnaires : ---
✅ Contact préféré : ---
✅ Email/Téléphone : ---
✅ Confidentialité : ---

---

Neuf ou usagé ? (N/U)`;
      
      return summaryFormat;
    }
    
    // If not a brand, ask for the brand
    return WELCOME_MESSAGES[language];
  }
  
  // Build the conversation context from history
  const conversationContext = history.map((msg, index) => {
    return `${msg.role.toUpperCase()}: ${msg.content}`;
  }).join('\n\n');
  
  try {
    // Send the full conversation context to OpenAI with proper system prompt
    const response = await sendMessageToOpenAI(conversationContext, language);
    return response;
  } catch (error) {
    console.error('Error in chatWithSam:', error);
    const errorMessage = language === 'en' ? 
      'Sam is on sick leave 🤒' : 
      'Sam est en congé de maladie 🤒';
    throw new Error(errorMessage);
  }
}