import { useState } from 'react';
import { trpc } from "@/app/_trpc/client";
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const AddGoalButton = () => {
    // Force refresh data
    const utils = trpc.useContext()
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const { mutate: createSavingGoal } = trpc.createSavingGoal.useMutation({
        onSuccess: () => {
            utils.getUserGoals.invalidate()
            setIsOpen(false);
            setName('');
            setGoalAmount('');
        },
        onError: (error) => {
            console.error(error.message);
        }
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createSavingGoal({
            name,
            goalAmount: parseFloat(goalAmount),
        });
    };


    return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if (!v) { setIsOpen(v) }
        }}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                <Button>Add Goal  <Plus className="ml-1.5 h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent>
                <h1 className='flex z-40 font-semibold'>Your Goal</h1>

                <div>
                    <form onSubmit={handleSubmit} className='flex flex-row items-start justify-between gap-4 border-zinc-200'>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Goal Name"
                        />
                        <input
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            placeholder="Goal Amount"
                            type="number"
                        />
                        <Button><Plus className="h-4 w-4" /></Button>
                    </form>
                </div>



            </DialogContent>
        </Dialog>
    );
}

export default AddGoalButton;
