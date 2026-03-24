import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractChunkData, InsertChunkData } from '../types/vector.type';
import { Vector } from '../entities/vector.entity';

export interface IVectorRepository {
  insertChunks(chunks: InsertChunkData[]): Promise<number>;
  insertChunk(chunk: InsertChunkData): Promise<Vector>;
  similaritySearch(query: number[]): Promise<ExtractChunkData[]>;
  deleteManyByFileId(fileId: string): Promise<void>;
  findByFileId(fileId: string): Promise<Vector | null>;
}

@Injectable()
export class VectorRepository implements IVectorRepository {
  constructor(
    @InjectModel(Vector.name, 'AI_DB')
    private readonly vectorModel: Model<Vector>,
  ) {}

  async insertChunks(chunks: InsertChunkData[]): Promise<number> {
    const insertResult = await this.vectorModel.insertMany(
      chunks.map(({ fileId, pageContent, vector }) => ({
        fileId,
        vector,
        pageContent,
      })),
    );
    return insertResult.length;
  }

  async insertChunk({ fileId, pageContent, vector }: InsertChunkData) {
    return await this.vectorModel.create({
      fileId,
      vector,
      pageContent,
    });
  }

  async findByFileId(fileId: string): Promise<Vector | null> {
    return await this.vectorModel.findOne({ fileId });
  }

  async deleteManyByFileId(fileId: string): Promise<void> {
    await this.vectorModel.deleteMany({ fileId });
  }

  async similaritySearch(query: number[]): Promise<ExtractChunkData[]> {
    const results = await this.vectorModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // indicate the index we goin to use for our search
          path: 'vector', // indicate the field the vectors are stored
          queryVector: query,
          numCandidates: 100, // number of chunks to consider for the comparison
          limit: 5, // the number of returned results on score order from high to low
        },
      },
      {
        $project: {
          // here we define wich fields we want to return, 1 return the field and 0 to hide it
          _id: 1,
          pageContent: 1,
          fileName: 1,
          fileId: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
    ]);

    return results as ExtractChunkData[];
  }
}
