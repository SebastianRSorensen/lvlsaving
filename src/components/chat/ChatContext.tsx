// Not an actual component

import React, { useState, createContext } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'


type StreamResponse = {
    addMessage: () => void
    message: string
    handleInputChange: (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({

    // Fallback valiues
    addMessage: () => { },
    message: '',
    handleInputChange: () => { },
    isLoading: false,

})

interface ChatProviderProps {
    goalId: string
    children: React.ReactNode

}
export const ChatProvider = ({ goalId, children }: ChatProviderProps) => {

    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()


    // Do not use tRPC here because we want to stream data
    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch(`/api/message`, {
                method: 'POST',
                body: JSON.stringify({
                    goalId: goalId,
                    message: message
                })
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            return response.body
        },

    })

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value)
    }
    const addMessage = () => sendMessage({ message })
    return (

        <ChatContext.Provider
            value={{
                addMessage,
                message,
                handleInputChange,
                isLoading,

            }}>
            {children}
        </ChatContext.Provider>
    )

}