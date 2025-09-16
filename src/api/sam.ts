import { chatWithSam } from "../lib/chatWithSam";
import { Language } from "../services/openai";

type Message = { role: "user" | "assistant"; content: string };

export async function samHandler(history: Message[], language: Language = 'fr'): Promise<string> {
  try {
    const assistant = await chatWithSam(history, language);
    return assistant;
  } catch (err: any) {
    console.error(err);
    const errorMessage = language === 'en' ? 
      "Sam is on sick leave 🤒" : 
      "Sam est en congé de maladie 🤒";
    throw new Error(errorMessage);
  }
}