import { z } from 'zod';

export const SendMessageValidator = z.object({
    goalId: z.string(),
    message: z.string(),
});