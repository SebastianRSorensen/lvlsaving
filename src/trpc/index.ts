import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db';
import { z } from 'zod';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-config';

// Backend schema for the db

const CreateSavingGoalInput = z.object({
    name: z.string(),
    age: z.number(),
});

export const appRouter = router({


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

    // Get all the users goal
    getUserGoals: privateProcedure.query(async ({ ctx }) => {
        const { userId } = ctx

        return await db.savingGoal.findMany({
            where: {
                userId
            }
        })
    }),

    // Get just the one goal
    getUserGoal: privateProcedure.input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            const goal = await db.savingGoal.findFirst({
                where: {
                    id: input.id,
                    userId,
                }
            });

            if (!goal) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            return goal;
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


    transferOnUserGoal: privateProcedure.input(
        z.object({
            id: z.string(),
            amount: z.number(), // Include amount in the schema
        })).mutation(async ({ ctx, input }) => {
            const { userId } = ctx;

            // Fetch the current state of the goal
            const currentGoal = await db.savingGoal.findUnique({
                where: {
                    id: input.id,
                    userId,
                },
            });

            if (!currentGoal) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            // Ensure the withdrawal amount doesn't exceed the currentAmount
            if (currentGoal.currentAmount + input.amount < 0) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Withdrawal amount exceeds the current balance.' });
            }

            // Update the goal
            const updatedGoal = await db.savingGoal.update({
                where: {
                    id: input.id,
                    userId,
                },
                data: {
                    currentAmount: {
                        increment: input.amount, // Use Prisma's increment feature
                    },
                },
            });

            return updatedGoal;
        }),

    createSavingGoal: privateProcedure.input(
        z.object({
            name: z.string(),
            goalAmount: z.number(),
        })
    ).mutation(async ({ ctx, input }) => {
        const { userId } = ctx;

        if (input.goalAmount <= 0) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Goal amount is below or equal to 0.' });
        }

        const newGoal = await db.savingGoal.create({
            data: {
                name: input.name,
                goalAmount: input.goalAmount,
                userId,
            },
        });

        return newGoal;
    }),


    // Get the messages
    getGoalmessages: privateProcedure.input
        (z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(),
            savingGoalId: z.string()
        })).
        query(async ({ ctx, input }) => {
            const { userId } = ctx
            const { savingGoalId, cursor } = input
            const limit = input.limit ?? INFINITE_QUERY_LIMIT

            const goal = await db.savingGoal.findFirst({
                where: {
                    id: savingGoalId,
                    userId,
                },
            })
            if (!goal) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const messages = await db.message.findMany({
                take: limit + 1, // +1 for cursor to get the next x-number of messages ready
                where: {
                    savingGoalId,
                },
                orderBy: {
                    createdAt: "desc",
                },
                cursor: cursor ? {
                    id: cursor,
                } : undefined,
                select: {
                    id: true,
                    text: true,
                    isUserMessage: true,
                    createdAt: true,
                }
            })

            let nextCursor: typeof cursor | undefined = undefined
            if (messages.length > limit) {
                const nextItem = messages.pop()
                nextCursor = nextItem?.id
            }

            return {
                messages,
                nextCursor,
            }
        })



});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;