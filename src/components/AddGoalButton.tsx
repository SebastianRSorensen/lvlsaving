'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"
import { Form } from "./ui/form"

const AddGoalButton = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    // const router = useRouter()

    // const [isUploading, setIsUploading] =
    //     useState<boolean>(false)
    // const [uploadProgress, setUploadProgress] =
    //     useState<number>(0)
    // //   const { toast } = useToast()

    return (

        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) { setIsOpen(v) }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Add Goal  <Plus className="ml-1.5 h-4 w-4" /></Button>
            </DialogTrigger>

            <DialogContent>
                {/* TODO: Add input in form */}
                <Form />
                <h1>Content</h1>
            </DialogContent>
        </Dialog>
    )
}

export default AddGoalButton