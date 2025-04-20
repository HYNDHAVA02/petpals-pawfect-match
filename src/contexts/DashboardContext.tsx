
import { createContext, useContext, useCallback } from 'react';
import { Pet } from "@/components/PetCard";
import { usePets, useMatches } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { MatchedPets } from "@/types/match";

type DashboardContextType = {
  userPets: Pet[];
  matches: MatchedPets[];
  isLoadingPets: boolean;
  isLoadingMatches: boolean;
  handlePetsUpdate: () => void;
  handleMatchesUpdate: () => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { data: userPetsData, isLoading: isLoadingPets, refetch: refetchPets } = usePets(user?.id);
  const { data: matchesData, isLoading: isLoadingMatches, refetch: refetchMatches } = useMatches(user?.id);

  const handlePetsUpdate = useCallback(() => {
    refetchPets();
  }, [refetchPets]);

  const handleMatchesUpdate = useCallback(() => {
    refetchMatches();
  }, [refetchMatches]);

  // Transform the pet data to match the Pet interface
  const userPets: Pet[] = userPetsData?.map((pet) => ({
    id: pet.id,
    name: pet.name,
    age: pet.age,
    breed: pet.breed,
    gender: pet.gender as "male" | "female",
    bio: pet.bio || "",
    imageUrl: pet.image_url || "/placeholder.svg",
    ownerId: pet.owner_id,
    ownerName: pet.owner_name || "Pet Owner",
  })) || [];

  // Use the matches data directly as it now conforms to MatchedPets type
  const matches: MatchedPets[] = matchesData || [];

  const value = {
    userPets,
    matches,
    isLoadingPets,
    isLoadingMatches,
    handlePetsUpdate,
    handleMatchesUpdate,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
