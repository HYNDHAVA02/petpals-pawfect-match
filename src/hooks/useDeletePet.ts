
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeletePet = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const checkIfPetHasMatches = async (petId: string) => {
    try {
      // Check if pet is in any matches as pet_id
      const { data: matches1, error: error1 } = await supabase
        .from("matches")
        .select("id")
        .eq("pet_id", petId)
        .eq("status", "accepted");

      if (error1) throw error1;

      // Check if pet is in any matches as matched_pet_id
      const { data: matches2, error: error2 } = await supabase
        .from("matches")
        .select("id")
        .eq("matched_pet_id", petId)
        .eq("status", "accepted");

      if (error2) throw error2;

      return (matches1?.length || 0) + (matches2?.length || 0) > 0;
    } catch (error) {
      console.error("Error checking if pet has matches:", error);
      return false;
    }
  };

  const deletePet = async (petId: string, forceDelete: boolean = false) => {
    setIsDeleting(true);
    
    try {
      // Check if pet has matches
      if (!forceDelete) {
        const hasMatches = await checkIfPetHasMatches(petId);
        
        if (hasMatches) {
          setIsDeleting(false);
          // Return true to indicate pet has matches and wasn't deleted
          return true;
        }
      }
      
      // If force delete or no matches, proceed with deletion
      if (forceDelete) {
        // Notify matches about this pet being deleted
        await notifyMatchesAboutDeletion(petId);
      }
      
      // Delete the pet
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);
      
      if (error) throw error;
      
      toast({
        title: "Pet deleted",
        description: "Your pet has been successfully deleted",
      });
      
      return false;
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast({
        title: "Error",
        description: "Failed to delete pet",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const notifyMatchesAboutDeletion = async (petId: string) => {
    try {
      // Get all matches where this pet is involved
      const { data: matches1 } = await supabase
        .from("matches")
        .select("id, matched_pet_id")
        .eq("pet_id", petId)
        .eq("status", "accepted");

      const { data: matches2 } = await supabase
        .from("matches")
        .select("id, pet_id")
        .eq("matched_pet_id", petId)
        .eq("status", "accepted");

      // Add a message to each match conversation about the pet being deleted
      const timestamp = new Date().toISOString();
      
      // Process first set of matches
      if (matches1 && matches1.length > 0) {
        for (const match of matches1) {
          await supabase.from("messages").insert({
            match_id: match.id,
            sender_id: petId, // Using pet ID as sender to indicate system message
            content: "This pet has been removed by its owner and is no longer available for matching.",
            created_at: timestamp,
          });
        }
      }
      
      // Process second set of matches
      if (matches2 && matches2.length > 0) {
        for (const match of matches2) {
          await supabase.from("messages").insert({
            match_id: match.id,
            sender_id: petId, // Using pet ID as sender to indicate system message
            content: "This pet has been removed by its owner and is no longer available for matching.",
            created_at: timestamp,
          });
        }
      }
    } catch (error) {
      console.error("Error notifying matches about deletion:", error);
    }
  };

  return { deletePet, isDeleting };
};
