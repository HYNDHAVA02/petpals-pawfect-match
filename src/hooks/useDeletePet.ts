
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeletePet = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const checkIfPetHasMatches = async (petId: string) => {
    try {
      // Check if pet has any accepted matches as the initiator
      const { data: matches1, error: error1 } = await supabase
        .from("matches")
        .select("id")
        .eq("pet_id", petId)
        .eq("status", "accepted");

      if (error1) throw error1;

      // Check if pet has any accepted matches as the matched pet
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

      // Add notification messages to each match conversation
      const timestamp = new Date().toISOString();
      
      // Process first set of matches where pet initiated
      if (matches1 && matches1.length > 0) {
        for (const match of matches1) {
          // Insert system message to notify about pet deletion
          await supabase.from("messages").insert({
            match_id: match.id,
            sender_id: petId,
            content: "This pet has been removed by its owner and is no longer available for matching.",
            created_at: timestamp,
          });
        }
      }
      
      // Process second set of matches where pet was matched with
      if (matches2 && matches2.length > 0) {
        for (const match of matches2) {
          // Insert system message to notify about pet deletion
          await supabase.from("messages").insert({
            match_id: match.id,
            sender_id: petId,
            content: "This pet has been removed by its owner and is no longer available for matching.",
            created_at: timestamp,
          });
        }
      }
    } catch (error) {
      console.error("Error notifying matches about deletion:", error);
    }
  };

  const deletePet = async (petId: string, forceDelete: boolean = false) => {
    setIsDeleting(true);
    
    try {
      if (!forceDelete) {
        const hasMatches = await checkIfPetHasMatches(petId);
        
        if (hasMatches) {
          setIsDeleting(false);
          return true; // Indicates pet has matches and wasn't deleted
        }
      }
      
      if (forceDelete) {
        // Notify matches about deletion before removing the pet
        await notifyMatchesAboutDeletion(petId);
      }
      
      // Delete the pet record from the database
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);
      
      if (error) throw error;
      
      toast({
        title: "Pet deleted",
        description: "Your pet has been successfully deleted",
      });
      
      return false; // Indicates successful deletion
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

  return { deletePet, isDeleting };
};
