import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";


export const POST = async (req: NextRequest) => {
    // endpoint for asking questions to the money bot

    const body = await req.json();

    const { getUser } = getKindeServerSession()
    const user = getUser()

    const { id: userId } = user

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { savingGoalId, message } = SendMessageValidator.parse(body)

    const goal = await db.savingGoal.findFirst({
        where: {
            id: savingGoalId,
            userId
        },
    })

    if (!goal) {
        return new Response('Not found', { status: 404 })
    }

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            savingGoalId,
        },
    })

    // Use "take: x" last messages as context for AI
    const prevMessages = await db.message.findMany({
        where: {
            savingGoalId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 7,
    })

    // Format prev messages to be used by AI
    const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? "user" as const : "bot" as const,
        content: msg.text,
    }))
    // console.log(formattedPrevMessages); // debug


    // Get AI response
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0, // 0 = deterministic, higher = more random (2 is max)
        stream: true,
        // to send prev messages as context
        messages: [
            {
                role: 'system',
                content:
                    'Use the following previous conversaton (if there is any) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following previous conversaton (if there is any) to answer the my question in markdown format. \nIf you don't know the answer I want you to try your best to guess what it is.

                \n----------------\n

                PREVIOUS CONVERSATION:
                ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user') return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}

                \n----------------\n


                USER INPUT: ${message}`,
            },
        ],
    })

    // Get AI response as text (streamed), also the reason we cant use custom tRPC response
    const stream = OpenAIStream(response, {
        async onCompletion(completion) {
            await db.message.create({
                data: {
                    text: completion,
                    isUserMessage: false,
                    savingGoalId,
                    userId,
                },
            })
        },
    })

    return new StreamingTextResponse(stream)

}