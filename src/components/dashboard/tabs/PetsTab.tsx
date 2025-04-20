
import { PetsList } from "../PetsList";
import { useDashboard } from "@/contexts/DashboardContext";

export const PetsTab = () => {
  const { userPets, isLoadingPets } = useDashboard();

  return <PetsList userPets={userPets} isLoadingPets={isLoadingPets} />;
};
