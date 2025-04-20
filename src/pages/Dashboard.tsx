
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Pet } from "@/components/PetCard";
import { useNavigate } from "react-router-dom";
import { usePets } from "@/hooks/useSupabase";
import { mockMatches } from "@/data/mockData";
import { PetOverview } from "@/components/dashboard/PetOverview";
import { MatchesOverview } from "@/components/dashboard/MatchesOverview";
import { ActivityOverview } from "@/components/dashboard/ActivityOverview";
import { PetsList } from "@/components/dashboard/PetsList";
import { MatchesList } from "@/components/dashboard/MatchesList";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches] = useState<Pet[]>(mockMatches);

  // Fetch real pets from Supabase
  const { data: userPetsData, isLoading: isLoadingPets } = usePets(user?.id);

  // Transform the pet data to match the Pet interface
  const userPets: Pet[] = userPetsData?.map((pet) => ({
    id: pet.id,
    name: pet.name,
    age: pet.age,
    breed: pet.breed,
    gender: pet.gender as "male" | "female", // Type assertion to fix the error
    bio: pet.bio || "",
    imageUrl: pet.image_url || "/placeholder.svg",
    ownerId: pet.owner_id,
    ownerName: user?.user_metadata?.full_name || "Pet Owner",
  })) || [];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pets">Your Pets</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PetOverview userPets={userPets} isLoadingPets={isLoadingPets} />
                <MatchesOverview matches={matches} />
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
