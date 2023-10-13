
// DONT NEED THIS COMPONENT ANYMORE

'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { trpc } from "@/app/_trpc/client"
import { Input } from "./ui/input"
import { Form } from "./ui/form"

const AddGoalButton = () => {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { mutate: startPolling } = trpc.getUserGoal.useMutation({
        onSuccess: (goal) => {
            router.push(`/dashboard/${goal.id}`)
        },
        retry: true,
        retryDelay: 500,
    })

    return (

        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) { setIsOpen(v) }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Add Goal  <Plus className="ml-1.5 h-4 w-4" /></Button>
            </DialogTrigger>

            <DialogContent>
                <h1>Content</h1>

            </DialogContent>
        </Dialog>
    )
}

export default AddGoalButton