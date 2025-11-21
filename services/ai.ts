
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY is not defined in process.env");
  return new GoogleGenAI({ apiKey });
};

export const enhanceBio = async (currentBio: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Rewrite the following professional bio to be more engaging, impactful, and concise for a developer portfolio website. Keep the tone professional but approachable. 
    
    Current Bio: "${currentBio}"`,
  });
  
  return response.text || currentBio;
};

export const generateProjectDescription = async (title: string, tags: string[]): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write a short, compelling description (maximum 2 sentences) for a software project titled "${title}" built using these technologies: ${tags.join(', ')}. Focus on the value and functionality.`,
  });

  return response.text || "A cool project.";
};
