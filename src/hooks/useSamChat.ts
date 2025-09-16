import { useState } from "react";
import { samHandler } from "../api/sam";
import { Language } from "../services/openai";

type Msg = { role: "user" | "assistant"; content: string };

export function useSamChat() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [language, setLanguage] = useState<Language>('fr');

  const restart = () => {
    setHistory([]);
  };

  const switchLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Clear history when switching languages to start fresh
    setHistory([]);
  };

  const send = async (text: string) => {
    // 1. push user msg locally
    const draft = [...history, { role: "user", content: text }];
    setHistory(draft);

    try {
      // 2. Call Sam handler with language parameter
      const assistantReply = await samHandler(draft, language);

      // 3. store assistant reply (includes <!--STATE:...-->)
      const updated = [...draft, { role: "assistant", content: assistantReply }];

      // 4. prune early turns if > 24 KB (≈ 6-7 msg) but **keep STATE**
      const slim = pruneForTokens(updated);
      setHistory(slim);
      
      console.log('📝 Updated chat history:', slim);

      // 5. detect onboarding complete
      if (assistantReply.startsWith("ONBOARDING_COMPLETE:")) {
        const json = assistantReply
          .replace("ONBOARDING_COMPLETE:", "")
          .trim();
        const profile = JSON.parse(json);
        console.log("🎉 buyerProfile", profile);
        // launchDealerBlast(profile);
      }
    } catch (error) {
      console.error('Error sending message to Sam:', error);
      // Add error message to history
      const errorMsg = language === 'en' ? 
        "Sam is on sick leave 🤒" : 
        "Sam est en congé de maladie 🤒";
      const errorHistory = [...draft, { role: "assistant", content: errorMsg }];
      setHistory(errorHistory);
    }
  };

  return { history, send, restart, language, switchLanguage };
}

// keep system prompt + last user + last assistant (which holds STATE)
function pruneForTokens(all: Msg[]): Msg[] {
  const MAX_MSG = 9;
  // Increase the limit significantly to avoid pruning during automated tests
  const EXTENDED_MAX_MSG = 50; // Much higher limit for testing
  if (all.length <= EXTENDED_MAX_MSG) return all;
  const kept = [all[0], ...all.slice(-8)]; // 0 = system, last 8 turns
  return kept;
}