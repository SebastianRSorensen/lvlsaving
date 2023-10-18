'use client'

import { trpc } from '@/app/_trpc/client'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContext, ChatProvider } from './ChatContext'


interface ChatWrapperProps {
    savingGoalId: string
}

const ChatWrapper = ({
    savingGoalId
}: ChatWrapperProps) => {
    console.log("Using savingGoalId in ChatWrapper.tsx:", savingGoalId);



    return (

        <ChatProvider savingGoalId={savingGoalId}>

            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 justify-between flex flex-col mb-28'>
                    <Messages savingGoalId={savingGoalId} />
                </div>

                <ChatInput />
            </div>
        </ChatProvider>
    )
}

export default ChatWrapper