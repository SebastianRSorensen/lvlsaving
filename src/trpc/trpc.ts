import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
import { get } from 'http';

/**
 * Initialization of tRPC backend
 */
const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }


    return opts.next({
        ctx: {
            userId: user.id,
            user,
        }
    });
}
)
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure; // Alle kan kalle denne
export const privateProcedure = t.procedure.use(isAuth); // Må være logget inn for å kalle denne