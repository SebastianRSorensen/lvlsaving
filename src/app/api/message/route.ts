import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";


export const POST = async (req: NextRequest) => {
    // endpoint for asking questions to the money bot

    const body = await req.json();

    const { getUser } = getKindeServerSession()
    const user = getUser()

    const { id: userId } = user

    if (!userId) {
        new Response('Unauthorized', { status: 401 })
    }

    const { goalId, message } = SendMessageValidator.parse(body)

    const goal = await db.savingGoal.findFirst({
        where: {
            id: goalId,
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
            savingGoalId: goalId,
        },
    })

    // AI PART
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    })

    // Use "take: x" last messages sendt by user for context
    const prevMessages = await db.message.findMany({
        where: {
            savingGoalId: goalId,
        },
        orderBy: {
            createdAt: "asc",
        },
        take: 7,
    })

    // Format prev messages to be used by AI
    const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? "user" as const : "bot" as const,
        content: msg.text,
    }))

    // Get AI response
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        // to send prev messages as context
        messages: [
            {
                role: 'system',
                content:
                    'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
                  
            \n----------------\n
            
            PREVIOUS CONVERSATION:
            ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user') return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}
            
            \n----------------\n
            
            CONTEXT:
            Not added yet


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
                    savingGoalId: goalId,
                    userId,
                },
            })
        },
    })

    return new StreamingTextResponse(stream)

}