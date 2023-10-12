import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { z } from 'zod';

export const appRouter = router({
    // publicProcedure.query    -> for get requests
    // publicProcedure.mutation -> for post/patch/delete requests (modifying data)

    authCallback: publicProcedure.query(async () => {
        const { getUser } = getKindeServerSession()
        const user = getUser()

        if (!user.id || !user.email)
            throw new TRPCError({ code: 'UNAUTHORIZED' })

        // Check if user exists in database
        // Hadde først id som en Int men fikk da kompileringsfeil pga typesjekk (tommel opp)
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            },
        })

        // Add user to db if not exists
        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email
                },
            })

        }


        return { success: true }
    }),
    getUserGoals: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx

        return await db.savingGoal.findMany({
            where: {
                userId
            }
        })
    }),
    deleteUserGoal: privateProcedure.input(z.object({ id: z.string() })
    ).mutation(async ({ ctx, input }) => {
        const { userId } = ctx

        const goal = await db.savingGoal.findFirst({
            where: {
                id: input.id,
                userId,
            }
        })
        if (!goal) {
            throw new TRPCError({ code: 'NOT_FOUND' })
        }

        await db.savingGoal.delete({
            where: {
                id: input.id,
                userId,
            },
        })
        return goal // return deleted goal, dont need it at frontend but good for testing
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;