import { Injectable } from '@nestjs/common';
import { LoaderService } from './loader.service';
import { EmbeddingService } from './embedding.service';
import { VectorRepository } from '../repositories/vector.repository';
import { ChatRepository } from '../repositories/chat.repository';
import { InsertChunkData } from '../types/vector.type';
import { ChatGoogle } from '@langchain/google';
import mongoose from 'mongoose';

@Injectable()
export class AIService {
  private readonly googleAI: ChatGoogle;

  constructor(
    private readonly loader: LoaderService,
    private readonly embed: EmbeddingService,
    private readonly vectorRepository: VectorRepository,
    private readonly chatRepository: ChatRepository,
  ) {
    this.googleAI = new ChatGoogle({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });
  }

  AI_RULES = `You are a helpful AI assistant for a gaming platform. Follow these guidelines:

RESPONSE GUIDELINES:
- Answer naturally and conversationally, not like a robot
- Use the provided context to answer questions accurately
- If context doesn't contain the answer, say "I don't have information about that"
- Never mention "context", "documents", "search results", or "data" in your responses
- Don't explain how you found the information or reference sources
- Keep answers concise but complete (2-4 sentences typically)

CONTEXT USAGE:
- Use context facts to provide specific, accurate information
- Combine multiple context pieces when relevant
- If context conflicts, use the most recent/relevant information
- Don't make up details not present in the context

LANGUAGE & TONE:
- Respond in English or Vietnamese based on the user's language
- Be friendly, helpful, and professional
- For gaming questions, show enthusiasm and knowledge
- Avoid technical jargon unless the user uses it first

ANSWER STRUCTURE:
- Direct answer first, then brief explanation if needed
- Use bullet points for lists (max 3-4 items)
- Include specific details from context (prices, dates, names)
- End with a helpful follow-up if appropriate

EXAMPLES:
❌ "Based on the context I found, The Witcher 3 costs $29.99..."
✅ "The Witcher 3 costs $29.99. It's an RPG adventure game..."

❌ "According to the documents provided..."
✅ "Elden Ring is an action RPG released in 2022..."

If no relevant context is found, respond with: "I don't have information about that. Would you like me to help you with something else?";`;

  async addText(text: string, fileId?: string) {
    try {
      const chunks = await this.loader.rawTextLoader(text);
      const vectors = await this.embed.embedDocuments(chunks);

      const toStoreChunks = chunks.map((chunk, index) => {
        return <InsertChunkData>{
          fileId: fileId || new mongoose.Types.ObjectId().toString(),
          pageContent: chunk,
          vector: vectors[index],
        };
      });

      return this.vectorRepository.insertChunks(toStoreChunks);
    } catch (error) {
      console.error('Error in addText:', error);
      throw error;
    }
  }

  async getText(query: string, userId: string, sessionId?: string) {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      if (!sessionId) {
        sessionId = new mongoose.Types.ObjectId().toString();
      }

      const vector = await this.embed.embedQuery(query);
      const result = await this.vectorRepository.similaritySearch(vector);

      const context = result.map((item) => item.pageContent).join('\n');

      console.log(context);
      let chatHistory = '';
      const history = await this.chatRepository.findBySessionId(sessionId, 5);
      chatHistory = history
        .map((chat) => `Q: ${chat.query}\nA: ${chat.response}`)
        .join('\n');

      const messages = [
        {
          role: 'system',
          content: this.AI_RULES,
        },
      ];

      if (chatHistory) {
        messages.push({
          role: 'system',
          content: `Previous conversation:\n${chatHistory}`,
        });
      }

      messages.push({
        role: 'user',
        content: `Question: ${query}\nContext: ${context}`,
      });

      const answer = await this.googleAI.invoke(messages);

      if (sessionId && context !== '') {
        await this.chatRepository.create({
          sessionId,
          userId,
          query,
          response: answer.content as string,
          message: query,
          context: context,
        });
      }

      return {
        ...answer,
        sessionId,
      };
    } catch (error) {
      console.error('Error in getText:', error);
      throw error;
    }
  }

  async getChatHistory(
    sessionId?: string,
    userId?: string,
    limit: number = 10,
  ) {
    try {
      if (sessionId) {
        return await this.chatRepository.findBySessionId(sessionId, limit);
      }
      if (userId) {
        return await this.chatRepository.findByUserId(userId, limit);
      }
      throw new Error('Either sessionId or userId must be provided');
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      throw error;
    }
  }

  async clearChatHistory(sessionId: string) {
    try {
      await this.chatRepository.deleteBySessionId(sessionId);
      return { message: 'Chat history cleared successfully' };
    } catch (error) {
      console.error('Error in clearChatHistory:', error);
      throw error;
    }
  }
}
