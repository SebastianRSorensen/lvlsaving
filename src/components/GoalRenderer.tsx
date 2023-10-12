'use client'

import { $Enums } from "@prisma/client";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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

    if (!goalData) {
        return <div>No goal data available</div>;
    }

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data: goal, refetch } = trpc.getUserGoal.useQuery({ id: goalData.id });

    // Force refresh data
    const utils = trpc.useContext();

    // transfer on goal 
    const transferMutation = trpc.transferOnUserGoal.useMutation({
        onSuccess: () => {
            // Invalidate the query to refresh data after transfer is successful
            utils.getUserGoal.invalidate();
            refetch();
        }
    });

    // Use the goalData prop to render the data as needed
    if (!goal) {
        return <div>Loading...</div>;
    }

    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className="mt-8 flex felx-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900"> {goal.name}</h1>
            </div>

            {/* Display progrss */}
            <div className="mt-4 flex-1 truncate">
                <div className=" mt-4 flex items-center space-x-3 ">
                    <h3 className="text-lg font-medium text-zinc-900">{goal.currentAmount}</h3>
                    <Progress value={goal.currentAmount} max={goal.goalAmount} />
                    <h3 className="text-lg font-medium text-zinc-900">{goal.goalAmount}</h3>
                </div>
            </div>
            <Button
                onClick={() => transferMutation.mutate({ id: goal.id, amount: 1000 })}
                disabled={transferMutation.isLoading}
            >
                {transferMutation.isLoading
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : "Transfer"
                }
            </Button>




        </main>
    );
}

export default GoalRenderer;

