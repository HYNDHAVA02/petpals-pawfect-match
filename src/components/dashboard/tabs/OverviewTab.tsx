
import { PetOverview } from "../PetOverview";
import { MatchesOverview } from "../MatchesOverview";
import { ActivityOverview } from "../ActivityOverview";
import { useDashboard } from "@/contexts/DashboardContext";

export const OverviewTab = () => {
  const { userPets, matches, isLoadingPets, handlePetsUpdate, handleMatchesUpdate } = useDashboard();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PetOverview 
          userPets={userPets} 
          isLoadingPets={isLoadingPets}
          onPetsUpdate={handlePetsUpdate}
        />
        <MatchesOverview 
          matches={matches}
          onMatchesUpdate={handleMatchesUpdate}
        />
      </div>
      <ActivityOverview />
    </>
  );
};
