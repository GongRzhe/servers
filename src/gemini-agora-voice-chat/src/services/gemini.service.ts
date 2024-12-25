import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  projectId: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  async generateResponse(text: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(text);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async startChat() {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      return model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  }

  async processChatMessage(chat: any, text: string): Promise<string> {
    try {
      const result = await chat.sendMessage(text);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing chat message:', error);
      throw error;
    }
  }
} 