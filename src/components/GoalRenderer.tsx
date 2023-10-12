'use client'

import { $Enums } from "@prisma/client";
import { Progress } from "./ui/progress";

interface GoalRendererProps {
    goalData: {
        id: string;
        name: string;
        goalAmount: number;
        currentAmount: number;
        addGoalStatus: $Enums.AddGoalStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
    } | null;
}

const GoalRenderer: React.FC<GoalRendererProps> = ({ goalData }) => {
    // Use the goalData prop to render the data as needed
    if (!goalData) {
        return <div>No goal data available</div>;
    }

    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className="mt-8 flex felx-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900"> {goalData.name}</h1>
            </div>

            {/* Display progrss */}
            <div className="mt-4 flex-1 truncate">
                <div className=" mt-4 flex items-center space-x-3 ">
                    <h3 className="text-lg font-medium text-zinc-900">{goalData.currentAmount}</h3>
                    <Progress value={goalData.currentAmount} max={goalData.goalAmount} />
                    <h3 className="text-lg font-medium text-zinc-900">{goalData.goalAmount}</h3>
                </div>
            </div>
        </main>
    );
}

export default GoalRenderer;



// 'use client'

// import { trpc } from "@/app/_trpc/client"
// import { useRouter } from "next/navigation"


// const GoalRenderer = () => {

//     // client side data fetching
//     // Get goals
//     const router = useRouter()
//     const { mutate: startPolling } = trpc.getGoal.useMutation(
//         {
//             onSuccess: (goal) => {
//                 router.push(`/dashboard/${goal.id}`)
//             },
//             retry: true,
//             retryDelay: 500,
//         }
//     )

//     return (
//         <div>GoalRenderer</div>
//     )
// }

// export default GoalRenderer