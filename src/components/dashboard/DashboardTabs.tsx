
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./tabs/OverviewTab";
import { PetsTab } from "./tabs/PetsTab";
import { MatchesTab } from "./tabs/MatchesTab";

export const DashboardTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pets">Your Pets</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="pets">
        <PetsTab />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchesTab />
      </TabsContent>
    </Tabs>
  );
};
