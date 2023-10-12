'use client'

import { useState } from "react"
import { Dialog } from "./ui/dialog"

const AddGoalButton = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (

        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) { setIsOpen(v) }
        }}></Dialog>
    )
}

export default AddGoalButton