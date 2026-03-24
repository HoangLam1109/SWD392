import { aiService } from "@/service/ai.service";
import type { AiPayload, AiResponse } from "@/types/AI.types";
import { useMutation } from "@tanstack/react-query";

export const useAI = () => {
    return useMutation<AiResponse, Error, AiPayload>({
        mutationFn: aiService.getText,
    });
}