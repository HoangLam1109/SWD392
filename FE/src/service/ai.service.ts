
import type { AiPayload } from "../types/AI.types";
import type { AiResponse } from "../types/AI.types";
import apiClient from "@/lib/apiClient";

export const aiService = {
    getText: async (payload: AiPayload) => {
        const response = await apiClient.post('/ai/query', payload);
        return response.data as AiResponse;
    }
}   