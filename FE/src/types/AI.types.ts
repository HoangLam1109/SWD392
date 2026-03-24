export interface AiPayload{
    query: string;
    sessionId?: string;
}
export interface AiResponse{
    content: string;
    sessionId: string;
}