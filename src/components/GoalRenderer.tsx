'use client'

import { $Enums } from "@prisma/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import GenericDialog from "./GenericDialog";
import Link from 'next/link';
import ShadowBg from "./ShadowBg";

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

    const { mutate: fetchGoal, data: goal } = trpc.getUserGoal.useMutation();
    const [error, setError] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [responseMessageType, setResponseMessageType] = useState<"success" | "error" | null>(null);
    const generateDialog = (action: "deposit" | "withdraw") => {
        const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);

        return (
            <GenericDialog
                trigger={
                    actionLabel === "Deposit" ?
                        (<Button>{actionLabel}</Button>) :
                        (<Button variant="destructive" size="sm">{actionLabel}</Button>)
                }

                content={(
                    <>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e: { target: { value: any; }; }) => setAmount(Number(e.target.value))}
                            placeholder="Enter amount"
                        />
                        <Button onClick={() => handleTransfer(action)}
                            variant={actionLabel === "Deposit" ? undefined : "destructive"}
                            disabled={transferMutation.isLoading}
                        >
                            {transferMutation.isLoading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : actionLabel
                            }
                        </Button>
                        {responseMessage &&
                            <p className={responseMessageType === "success" ? "text-green-500 mt-4" : "text-red-500 mt-4"}>
                                {responseMessage}
                            </p>
                        }
                    </>
                )}
            />
        );
    };

    // Force refresh data
    const utils = trpc.useContext();

    // transfer on goal 
    const transferMutation = trpc.transferOnUserGoal.useMutation({
        onSuccess: () => {
            // Invalidate the query to refresh data after transfer is successful
            fetchGoal({ id: goalData.id });
            setResponseMessage("Transfer successful");
            setResponseMessageType("success");
        },
        onError: (err) => {
            setResponseMessage("Transfer was not successful.");
            setResponseMessageType("error");
        }
    });


    useEffect(() => {
        fetchGoal({ id: goalData.id });
    }, [goalData.id, fetchGoal]);
    // Use effect to clear response message after a certain duration
    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => {
                setResponseMessage(null);
            }, 3000); // Clear after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [responseMessage]);

    if (!goal) {
        return <div>Loading...</div>;
    }

    const handleTransfer = (action: "deposit" | "withdraw") => {
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        setError(null); // Clear previous errors
        const actualAmount = action === "deposit" ? amount : -amount;
        transferMutation.mutate({ id: goal.id, amount: actualAmount });
    };

    return (
        <main className="mx-auto max-w-7xl md:p-10">
            {/* Sjekk sikkerheten til linken. Kan den nås av feil person? */}
            <Link
                href='/dashboard'
                className='flex z-40 font-semibold'>
                <ChevronLeft />Dashboard
            </Link>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl text-gray-900">{goal.name}</h1>
            </div>

            <div className="mt-4 flex-1 truncate">
                <div className="mt-4 flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-zinc-900">{goal.currentAmount}</h3>
                    <Progress value={goal.currentAmount} max={goal.goalAmount} />
                    <h3 className="text-lg font-medium text-zinc-900">{goal.goalAmount}</h3>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 pb-5 sm:flex-row sm:items-center sm:gap-0">

                {generateDialog("deposit")}
                {generateDialog("withdraw")}


            </div>
            <ShadowBg />
        </main>
    );
}

export default GoalRenderer;
