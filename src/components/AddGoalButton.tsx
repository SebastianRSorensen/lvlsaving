'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"

const AddGoalButton = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (

        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) { setIsOpen(v) }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Add Goal</Button>
            </DialogTrigger>


            <DialogContent>
                <h1>Content</h1>
            </DialogContent>
        </Dialog>
    )
}

export default AddGoalButton