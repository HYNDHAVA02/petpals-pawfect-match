
import { PetsList } from "../PetsList";
import { useDashboard } from "@/contexts/DashboardContext";

export const PetsTab = () => {
  const { userPets, isLoadingPets, handlePetsUpdate } = useDashboard();

  return <PetsList userPets={userPets} isLoadingPets={isLoadingPets} onPetsUpdate={handlePetsUpdate} />;
};
