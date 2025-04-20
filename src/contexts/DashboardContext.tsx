
import { createContext, useContext, useCallback } from 'react';
import { Pet } from "@/components/PetCard";
import { usePets } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";

type DashboardContextType = {
  userPets: Pet[];
  matches: Pet[];
  isLoadingPets: boolean;
  handlePetsUpdate: () => void;
  handleMatchesUpdate: () => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children, matches }: { children: React.ReactNode; matches: Pet[] }) => {
  const { user } = useAuth();
  const { data: userPetsData, isLoading: isLoadingPets, refetch: refetchPets } = usePets(user?.id);

  const handlePetsUpdate = useCallback(() => {
    refetchPets();
  }, [refetchPets]);

  const handleMatchesUpdate = useCallback(() => {
    console.log("Matches updated");
  }, []);

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
    ownerName: user?.user_metadata?.full_name || "Pet Owner",
  })) || [];

  const value = {
    userPets,
    matches,
    isLoadingPets,
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
