
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}

const ErrorDialog = ({ open, onOpenChange, message }: ErrorDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unable to start chat</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end">
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-petpals-purple hover:bg-petpals-purple/90"
          >
            OK
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ErrorDialog;
