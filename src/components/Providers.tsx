'use client'

import { PropsWithChildren, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/app/_trpc/client"
import { httpBatchLink } from "@trpc/client"
import { absoluteUrl } from "@/lib/utils"

// Oppsettet til trpc som får den til å fungere med react-query for å få type safety
const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                // Absolute URL for development
                url: absoluteUrl('/api/trpc'),
            }),
        ],
    }))

    return (
        <trpc.Provider // Gjør at vi kan bruke trpc i alle komponenter gjennom hele applikasjonen
            client={trpcClient}
            queryClient={queryClient}>

            <QueryClientProvider client={queryClient} //Gjør at vi også kan velge å bruke react-query uten trpc
            >
                {children}
            </QueryClientProvider>
        </trpc.Provider >
    )
}

export default Providers