
import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { Pet } from "@/components/PetCard";
import { usePets, useMatches } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type DashboardContextType = {
  userPets: Pet[];
  matches: Pet[];
  isLoadingPets: boolean;
  isLoadingMatches: boolean;
  handlePetsUpdate: () => void;
  handleMatchesUpdate: () => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: userPetsData, isLoading: isLoadingPets, refetch: refetchPets } = usePets(user?.id);
  const { data: matchesData, isLoading: isLoadingMatches, refetch: refetchMatches } = useMatches(user?.id);
  const [ownerNames, setOwnerNames] = useState<Record<string, string>>({});

  // Fetch owner names for matched pets
  useEffect(() => {
    const fetchOwnerNames = async () => {
      if (!matchesData || matchesData.length === 0) return;
      
      try {
        // Get unique owner IDs from matches
        const ownerIds = matchesData.map(match => {
          // Determine which pet belongs to another owner
          const isUserPetAsPetId = match.pet.owner_id === user?.id;
          const otherPet = isUserPetAsPetId ? match.matched_pet : match.pet;
          return otherPet.owner_id;
        }).filter((id, index, self) => self.indexOf(id) === index);
        
        if (ownerIds.length === 0) return;
        
        console.log('Fetching owner names for IDs:', ownerIds);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', ownerIds);
          
        if (error) throw error;
        
        // Create a map of owner IDs to names
        const nameMap: Record<string, string> = {};
        data?.forEach(profile => {
          nameMap[profile.id] = profile.full_name || 'Pet Owner';
        });
        
        setOwnerNames(nameMap);
        console.log('Owner names fetched:', nameMap);
      } catch (error) {
        console.error('Error fetching owner names:', error);
        toast({
          title: "Error",
          description: "Failed to load pet owner information",
          variant: "destructive",
        });
      }
    };
    
    fetchOwnerNames();
  }, [matchesData, user?.id, toast]);

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          console.log('Profiles updated, refreshing owner names...');
          // When profiles are updated, refetch owner names
          if (matchesData && matchesData.length > 0) {
            const fetchUpdatedNames = async () => {
              try {
                const ownerIds = matchesData.map(match => {
                  const isUserPetAsPetId = match.pet.owner_id === user?.id;
                  const otherPet = isUserPetAsPetId ? match.matched_pet : match.pet;
                  return otherPet.owner_id;
                }).filter((id, index, self) => self.indexOf(id) === index);
                
                if (ownerIds.length === 0) return;
                
                const { data, error } = await supabase
                  .from('profiles')
                  .select('id, full_name')
                  .in('id', ownerIds);
                  
                if (error) throw error;
                
                const nameMap: Record<string, string> = {};
                data?.forEach(profile => {
                  nameMap[profile.id] = profile.full_name || 'Pet Owner';
                });
                
                setOwnerNames(nameMap);
              } catch (error) {
                console.error('Error updating owner names:', error);
              }
            };
            fetchUpdatedNames();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, matchesData]);

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
    ownerName: user?.user_metadata?.full_name || "Pet Owner",
  })) || [];

  // Transform matches data to Pet interface
  const matches: Pet[] = (matchesData || []).map((match) => {
    // Determine which pet belongs to another owner
    const isUserPetAsPetId = match.pet.owner_id === user?.id;
    const matchedPet = isUserPetAsPetId ? match.matched_pet : match.pet;
    
    return {
      id: matchedPet.id,
      name: matchedPet.name,
      age: matchedPet.age,
      breed: matchedPet.breed,
      gender: matchedPet.gender as "male" | "female",
      bio: matchedPet.bio || "",
      imageUrl: matchedPet.image_url || "/placeholder.svg",
      ownerId: matchedPet.owner_id,
      ownerName: ownerNames[matchedPet.owner_id] || "Pet Owner",
    };
  });

  console.log('Processed matches in context:', matches.length);
  console.log('Owner names available:', Object.keys(ownerNames).length);
  console.log('Sample matches with owner names:', matches.map(m => ({
    petName: m.name,
    ownerName: m.ownerName,
    ownerId: m.ownerId
  })));

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
