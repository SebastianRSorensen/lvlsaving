import GoalRenderer from "@/components/GoalRenderer"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound, redirect } from "next/navigation"
import ChatWrapper from "@/components/chat/ChatWrapper"

interface PageProps {
    params: {
        goalid: string
    }
}

const page = async ({ params }: PageProps) => {

    // retrive goal id
    const { goalid } = params

    // check that user is logged in
    const { getUser } = getKindeServerSession()
    const user = getUser()

    // If user is not logged in but still access this page, redirect to auth callback
    // If user is logged then redirect to back automatically with origin=dashboard/${goalid}
    if (!user || !user.id) {
        redirect(`/auth-callback?origin=dashboard/${goalid}`)
    }

    // call db to get goal data
    const goal = await db.savingGoal.findFirst({
        where: {
            id: goalid,
            userId: user.id,
        },
    })

    if (!goal) {
        notFound()
    }


    return (
        <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
            {/* Your goal Id {goalid} */}
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                {/* Left side */}
                <div className="flex-1 xl:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        <GoalRenderer goalData={goal} />
                    </div>
                </div>
                <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    {/* Right side */}
                    <ChatWrapper savingGoalId={goal.id} />
                </div>
            </div>
        </div >
    )
}

export default page