
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "@/contexts/DashboardContext";
import { PetOverview } from "./PetOverview";
import { MatchesOverview } from "./MatchesOverview";
import { ActivityOverview } from "./ActivityOverview";
import { PetsList } from "./PetsList";
import { MatchesList } from "./MatchesList";

export const DashboardTabs = () => {
  const { userPets, matches, isLoadingPets, handlePetsUpdate, handleMatchesUpdate } = useDashboard();

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pets">Your Pets</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
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
      </TabsContent>
      
      <TabsContent value="pets">
        <PetsList userPets={userPets} isLoadingPets={isLoadingPets} />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchesList matches={matches} />
      </TabsContent>
    </Tabs>
  );
};
