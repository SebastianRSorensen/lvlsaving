import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db';

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

        // Create user if not exists
        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email
                },
            })

        }


        return { success: true }
    })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;