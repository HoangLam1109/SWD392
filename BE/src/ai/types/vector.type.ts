export interface InsertChunkData {
  vector: number[];
  pageContent: string;
  fileId: string;
}

export type ExtractChunkData = {
  _id: string;
  score: number;
  pageContent: string;
  fileName: string;
  fileId: string;
};
