'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"
import { Loader2 } from "lucide-react"

// Runs when page is loaded
const Page = () => {
    const router = useRouter()

    // Get origin from url
    const searchParams = useSearchParams()
    const origin = searchParams.get("origin")

    trpc.authCallback.useQuery(undefined, {
        onSuccess: ({ success }) => {
            if (success) { //user in db
                router.push(origin ? `/${origin}` : '/dashboard')
            }
        },
        // Depcrecated but makes sence since im throwing error in ./trpc/index.ts
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") {
                router.push("/sign-in")
            }
        },
        retry: true,
        retryDelay: 500,

    })
    return (
        <div className="w-full mt-24 felx justify-center">
            <div className="flex felx-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
                <h3 className="font-semibold text-xl">Setting up your account...</h3>
                <p>You will be redirected automatically</p>
            </div>
        </div>
    )
}

export default Page