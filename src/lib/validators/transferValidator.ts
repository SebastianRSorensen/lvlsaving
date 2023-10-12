import { z } from 'zod';

export const transferValidator = z.object({
    goalId: z.string(),
    amount: z.float(),
});

