import { AppRouter } from '@/trpc';
import { createTRPCReact } from '@trpc/react-query';

/**
 * Initialization of tRPC frontend
 * Makes it possible to know the type of the router
 * typesafety mellom frontend og backend
 */
export const trpc = createTRPCReact<AppRouter>({});
