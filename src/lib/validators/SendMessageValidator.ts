import { z } from 'zod';

export const SendMessageValidator = z.object({
    savingGoalId: z.string(),
    message: z.string(),
});