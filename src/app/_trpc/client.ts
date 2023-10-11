import { AppRouter } from '@/trpc';
import { createTRPCReact } from '@trpc/react-query';

/**
 * Initialization of tRPC frontend
 * Should be done only once per frontend!
 * Makes it possible to know the type of the router
 */
export const trpc = createTRPCReact<AppRouter>({});
