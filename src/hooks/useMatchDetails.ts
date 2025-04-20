
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pet } from "@/components/PetCard";

export const useMatchDetails = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const findMatchId = async (petId: string) => {
    if (!userId) return null;

    try {
      const { data: userPets, error: userPetsError } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', userId);

      if (userPetsError) throw userPetsError;
      if (!userPets || userPets.length === 0) return null;

      const userPetIds = userPets.map(pet => pet.id);

      const { data: match1, error: match1Error } = await supabase
        .from('matches')
        .select('id')
        .in('pet_id', userPetIds)
        .eq('matched_pet_id', petId)
        .eq('status', 'accepted')
        .maybeSingle();

      if (match1Error) throw match1Error;
      if (match1) return match1.id;

      const { data: match2, error: match2Error } = await supabase
        .from('matches')
        .select('id')
        .eq('pet_id', petId)
        .in('matched_pet_id', userPetIds)
        .eq('status', 'accepted')
        .maybeSingle();

      if (match2Error) throw match2Error;
      if (match2) return match2.id;

      return null;
    } catch (error) {
      console.error("Error finding match ID:", error);
      return null;
    }
  };

  return {
    loading,
    setLoading,
    matchId,
    setMatchId,
    errorMessage,
    setErrorMessage,
    findMatchId
  };
};
