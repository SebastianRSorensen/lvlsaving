// Not an actual component

import React, { useState, createContext, useRef } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-config'
import { describe } from 'node:test'


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
    savingGoalId: string
    children: React.ReactNode

}

// For implementing an initial message to the AI in the future
// export const sendInitialMessage = async (initialMessage: string, savingGoalId: string) => {
//     const response = await fetch(`/api/message`, {
//         method: 'POST',
//         body: JSON.stringify({
//             savingGoalId,
//             message: initialMessage
//         })
//     });

//     if (!response.ok) {
//         throw new Error("Failed to send initial message");
//     }

//     return response.body;
// };

export const ChatProvider = ({ savingGoalId, children }: ChatProviderProps) => {

    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const utils = trpc.useContext()
    const backupMessage = useRef<string>("")

    const { toast } = useToast()




    // Do not use tRPC here because we want to stream data
    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch(`/api/message`, {
                method: 'POST',
                body: JSON.stringify({
                    savingGoalId,
                    message
                })
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            return response.body
        },

        onMutate: async ({ message }) => {
            backupMessage.current = message
            setMessage("")

            // Part 1: Optimistic update
            await utils.getGoalmessages.cancel()

            // Part 2: Get the previous messages
            const previousMessages = utils.getGoalmessages.getInfiniteData()

            // Part 3: 
            utils.getGoalmessages.setInfiniteData({
                savingGoalId, limit: INFINITE_QUERY_LIMIT
            },
                (old) => {
                    if (!old) {
                        return {
                            pages: [],
                            pageParams: [],
                        }
                    }
                    let newPages = [...old.pages]
                    let latestPage = newPages[0]! // We know this exists therefore the "!"
                    latestPage.messages = [
                        {
                            createdAt: new Date().toISOString(),
                            id: crypto.randomUUID(),
                            text: message,
                            isUserMessage: true,
                        },
                        ...latestPage.messages  // Spread inn all our other messages
                    ]

                    newPages[0] = latestPage

                    return {
                        ...old,
                        pages: newPages
                    }


                })
            setIsLoading(true)

            return { previousMessages: previousMessages?.pages.flatMap((page) => page.messages) ?? [] }
        },

        onSuccess: async (stream) => {
            setIsLoading(false)

            if (!stream) {
                return toast({
                    title: "Failed to send message",
                    description: "Please refresh the page and try again",
                    variant: "destructive"
                })
            }
            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false

            // accumulated response
            let accResponse = ""
            while (!done) {
                const { value, done: isDone } = await reader.read()
                done = isDone
                const chunkValue = decoder.decode(value) // The actual message from the AI
                accResponse += chunkValue


                // append chunk to response
                utils.getGoalmessages.setInfiniteData(
                    { savingGoalId, limit: INFINITE_QUERY_LIMIT },
                    (old) => {
                        if (!old) {
                            return {
                                pages: [],
                                pageParams: [],
                            }
                        }
                        let isAIResponseCreated = old.pages.some(
                            (page) => page.messages.some((message) =>
                                message.id === "ai-response"))

                        let updatePages = old.pages.map((page) => {
                            if (page === old.pages[0]) {
                                let updatedMessages

                                if (!isAIResponseCreated) {
                                    updatedMessages = [
                                        {
                                            createdAt: new Date().toISOString(),
                                            id: "ai-response",
                                            text: accResponse,
                                            isUserMessage: false,
                                        },
                                        ...page.messages
                                    ]
                                } else {
                                    updatedMessages = page.messages.map((message) => {
                                        if (message.id === "ai-response") {
                                            return {
                                                ...message,
                                                text: accResponse
                                            }
                                        }
                                        return message
                                    })
                                }
                                return {
                                    ...page,
                                    messages: updatedMessages
                                }

                            }
                            return page
                        })
                        return {
                            ...old,
                            pages: updatePages
                        }
                    }
                )
            }
        },

        onError: (_, __, context) => {
            setMessage(backupMessage.current)
            utils.getGoalmessages.setData(
                { savingGoalId },
                { messages: context?.previousMessages ?? [] }
            )
        },

        onSettled: async () => {
            setIsLoading(false)

            await utils.getGoalmessages.invalidate({ savingGoalId })
        }

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