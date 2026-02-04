
import { GoogleGenAI, Type } from "@google/genai";
import { IP2ProxyResult, SecurityInsight } from "../types";

export const analyzeRiskyIps = async (riskyResults: IP2ProxyResult[]): Promise<SecurityInsight[]> => {
  if (riskyResults.length === 0) return [];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze these IP detection results and provide security insights. 
  Results: ${JSON.stringify(riskyResults.map(r => ({
    ip: r.ipAddress,
    type: r.proxyType,
    isp: r.isp,
    fraud: r.fraudScore,
    country: r.countryLong
  })))}
  
  Focus on identifying high-risk actors and recommending mitigation steps for a system administrator.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ip: { type: Type.STRING },
              summary: { type: Type.STRING },
              riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              recommendation: { type: Type.STRING }
            },
            required: ['ip', 'summary', 'riskLevel', 'recommendation']
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return [];
  }
};
