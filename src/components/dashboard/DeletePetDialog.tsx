
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useDeletePet } from "@/hooks/useDeletePet";

interface DeletePetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
  onPetDeleted: () => void;
}

export const DeletePetDialog = ({
  isOpen,
  onOpenChange,
  petId,
  petName,
  onPetDeleted,
}: DeletePetDialogProps) => {
  const { deletePet, isDeleting } = useDeletePet();
  const [hasMatches, setHasMatches] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleDelete = async (forceDelete: boolean = false) => {
    const hasMatches = await deletePet(petId, forceDelete);
    
    if (hasMatches && !forceDelete) {
      setHasMatches(true);
      setShowWarning(true);
    } else {
      onOpenChange(false);
      onPetDeleted();
      setHasMatches(false);
      setShowWarning(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {!showWarning ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {petName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Warning: Pet Has Matches</AlertDialogTitle>
              <AlertDialogDescription>
                {petName} has active matches with other pets. If you delete {petName}, 
                the other pet owners will be notified that your pet is no longer available.
                Do you still want to proceed with deletion?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowWarning(false);
                  onOpenChange(false);
                }}
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(true);
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Anyway"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
