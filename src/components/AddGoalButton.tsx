'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

const AddGoalButton = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

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