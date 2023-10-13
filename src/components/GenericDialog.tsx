import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

interface GenericDialogProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
}

const GenericDialog: React.FC<GenericDialogProps> = ({ trigger, content }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
                {trigger}
            </DialogTrigger>

            <DialogContent>
                {content}
            </DialogContent>
        </Dialog>
    );
};

export default GenericDialog;
