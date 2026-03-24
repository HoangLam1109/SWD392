import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

@Injectable()
export class EmbeddingService {
  private model: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.model = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-001',
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    try {
      // Truncate text if too long (Google has limits)
      const truncatedTexts = texts.map((text) =>
        text.length > 8000 ? text.substring(0, 8000) : text,
      );

      const result = await this.model.embedDocuments(truncatedTexts);

      return result;
    } catch (error) {
      console.error('Error in embedDocuments:', error);
      throw error;
    }
  }

  async embedQuery(text: string): Promise<number[]> {
    const result = await this.model.embedQuery(text);
    return result;
  }
}
