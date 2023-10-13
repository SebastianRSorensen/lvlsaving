'use client'

import { trpc } from "@/app/_trpc/client"
import AddGoalButton from "./AddGoalButton"
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { useState } from "react"
import AddSavingGoal from "./AddSavingGoal"
import ShadowBg from "./ShadowBg"

const Dashboard = () => {
    // To show loading state on specific goal
    const [currentlyDeletingGoal, setCurrentlyDeletingGoal] = useState<string | null>(null)

    // Force refresh data
    const utils = trpc.useContext()

    // client side data fetching
    // Get goals
    const { data: goals, isLoading } = trpc.getUserGoals.useQuery()
    // Delete goal 
    const { mutate: deletUserGoal } = trpc.deleteUserGoal.useMutation({
        onSuccess: () => {
            utils.getUserGoals.invalidate()
        },
        onMutate({ id }) {
            setCurrentlyDeletingGoal(id)
        },
        onSettled() {
            setCurrentlyDeletingGoal(null)
        },
    })


    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className="mt-8 flex felx-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900"> My Goals</h1>

                <AddSavingGoal />

            </div>


            {/* Display goals */}
            {goals && goals?.length > 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                    {goals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((goal) => (
                        <li key={goal.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
                            <Link href={`/dashboard/${goal.id}`} className="flex flex-col gap-2">
                                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                                    {/* Display goal name with decorations*/}
                                    <div className="h-10 w-10 felx-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3 ">
                                            <h3 className="truncate text-lg font-medium text-zinc-900">{goal.name}</h3>

                                            <h3 className="truncate text-lg font-medium text-zinc-900 ml-auto">{Math.round((goal.currentAmount / goal.goalAmount) * 100)}% of {(goal.goalAmount / 1000).toFixed(2)}K</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 text-xs text-zinc-500">
                                <div className="flex items-center gap-2">
                                    Added {" "}
                                    {format(new Date(goal.createdAt), "MMM dd, yyyy")}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    mocked
                                </div>
                                <Button
                                    onClick={() =>
                                        deletUserGoal({ id: goal.id })}
                                    className="w-full" variant="destructive" size="sm">
                                    {currentlyDeletingGoal === goal.id ? ( // Spin loader while deleting
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) :
                                        <Trash className="h-4 w-4" />}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : isLoading ? (
                <Skeleton height={100} className="my-2" count={3} />
            ) : (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="font-semibold text-xl">No goals yet</h3>
                    <p>Let&apos;s create your first saving goal.</p>
                </div>
            )}

            <ShadowBg />


        </main>
    )
}

export default Dashboard