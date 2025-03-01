import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  gatheringTitle: string;
  gatheringDate: string;
}

export function RegistrationSuccessDialog({
  open,
  onClose,
  gatheringTitle,
  gatheringDate,
}: RegistrationSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Registration Successful!</DialogTitle>
          <DialogDescription className="text-center">
            You have successfully registered for:
            <div className="mt-2 font-medium text-foreground">
              {gatheringTitle}
              <br />
              <span className="text-sm">{new Date(gatheringDate).toLocaleDateString()}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
