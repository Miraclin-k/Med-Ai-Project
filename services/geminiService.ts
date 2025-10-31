import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeMedicalText(text: string): Promise<GenerateContentResponse> {
    const prompt = `Analyze the following medical text. Provide a structured summary, key findings, and recommendations. If the text is a lab report, extract key numerical values with their units and normal ranges. Format the output as JSON.
    Medical Text: "${text}"`;
    
    return this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendations: { type: Type.STRING },
                    extractedValues: {
                        type: Type.ARRAY,
                        nullable: true,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                value: { type: Type.NUMBER },
                                unit: { type: Type.STRING },
                                range: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                            }
                        }
                    }
                },
            },
        },
    });
  }

  async analyzeMedicalImage(base64Image: string, mimeType: string, prompt: string): Promise<GenerateContentResponse> {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };
    const textPart = {
      text: `${prompt}. Provide a structured analysis with a summary, key findings, and recommendations. Format as JSON.`,
    };

    return this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommendations: { type: Type.STRING },
                },
            },
        },
    });
  }
  
  async getDiagnosisSuggestion(symptoms: string, history: string): Promise<GenerateContentResponse> {
    const prompt = `A patient presents with the following symptoms: "${symptoms}". Their relevant medical history is: "${history}".
    Provide a list of differential diagnoses with confidence scores (0-1), a rationale for each, and flag any potential critical conditions.
    Format the output as JSON.`;

    return this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    potentialDiagnoses: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                condition: { type: Type.STRING },
                                confidence: { type: Type.NUMBER },
                                rationale: { type: Type.STRING },
                            }
                        }
                    },
                    criticalAlert: { type: Type.STRING, nullable: true },
                },
            },
        },
    });
  }

  // Live connection is handled directly in the component due to its interactive nature and callbacks.
  getLiveConnection() {
    return this.ai.live;
  }

  getChatManager() {
    return this.ai.chats;
  }
}

export const geminiService = new GeminiService();