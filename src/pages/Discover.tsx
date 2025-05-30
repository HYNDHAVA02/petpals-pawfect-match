
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PetCard, { Pet } from "@/components/PetCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Discover = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { location, error: locationError } = useLocation();
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [noMorePets, setNoMorePets] = useState(false);
  const [userPetsIds, setUserPetsIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchPets = async () => {
      try {
        setLoading(true);
        
        // Get the current user's pets
        const { data: userPets } = await supabase
          .from('pets')
          .select('id')
          .eq('owner_id', user.id);
        
        const userPetIds = userPets?.map(pet => pet.id) || [];
        setUserPetsIds(userPetIds);

        // Get all matches involving user's pets to exclude them
        const { data: matches } = await supabase
          .from('matches')
          .select('pet_id, matched_pet_id')
          .or(`pet_id.in.(${userPetIds.join(',')}),matched_pet_id.in.(${userPetIds.join(',')})`);

        // Create a set of all matched pet IDs
        const matchedPetIds = new Set<string>();
        matches?.forEach(match => {
          if (userPetIds.includes(match.pet_id)) {
            matchedPetIds.add(match.matched_pet_id);
          } else {
            matchedPetIds.add(match.pet_id);
          }
        });

        let query = supabase
          .from('pets')
          .select(`
            *,
            profiles:owner_id(full_name)
          `)
          .neq('owner_id', user.id);
          
        // Add condition to exclude matched pets if there are any
        if (matchedPetIds.size > 0) {
          query = query.not('id', 'in', `(${Array.from(matchedPetIds).join(',')})`);
        }

        // Get pets data
        const { data: pets, error } = await query;
        
        if (error) throw error;
        
        if (!pets || pets.length === 0) {
          setNoMorePets(true);
          setLoading(false);
          return;
        }
        
        // Format pets for the PetCard component and calculate distances if location is available
        let formattedPets: Pet[] = pets.map(pet => ({
          id: pet.id,
          name: pet.name,
          age: pet.age,
          breed: pet.breed,
          gender: pet.gender as "male" | "female",
          bio: pet.bio || "",
          imageUrl: pet.image_url || "/placeholder.svg",
          ownerId: pet.owner_id,
          ownerName: pet.owner_name || "Pet Owner",
          location: pet.location || "Unknown location",
          distance: undefined
        }));
        
        // If user location is available, calculate distances
        if (location) {
          // Calculate distance for each pet and add it to the pet object
          const petsWithDistance = await Promise.all(
            formattedPets.map(async (pet) => {
              const petData = pets.find(p => p.id === pet.id);
              if (petData?.latitude && petData?.longitude) {
                // Call the distance calculation function
                const { data: distanceData } = await supabase.rpc('calculate_distance', {
                  lat1: location.latitude,
                  lon1: location.longitude, 
                  lat2: petData.latitude,
                  lon2: petData.longitude
                });
                
                return {
                  ...pet,
                  distance: distanceData ? `${(distanceData / 1000).toFixed(1)} km away` : undefined
                };
              }
              return pet;
            })
          );
          
          // Sort pets by distance (closest first)
          formattedPets = petsWithDistance.sort((a, b) => {
            if (!a.distance || !b.distance) return 0;
            const distA = parseFloat(a.distance.split(' ')[0]);
            const distB = parseFloat(b.distance.split(' ')[0]);
            return distA - distB;
          });
        }
        
        setCurrentPets(formattedPets);
        setNoMorePets(formattedPets.length === 0);
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast({
          title: "Error",
          description: "Failed to load pets. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, [user, navigate, toast, location]);

  const handleSwipeRight = async (pet: Pet) => {
    console.log("Liked:", pet.name);
    
    if (userPetsIds.length === 0) {
      toast({
        title: "No pets found",
        description: "You need to add a pet first before matching.",
        variant: "destructive",
      });
      navigate("/pet-profile");
      return;
    }

    try {
      // For now, use the first pet of the user for matching
      const userPetId = userPetsIds[0];

      // Check if there's already a match from the other user
      const { data: existingMatch } = await supabase
        .from('matches')
        .select('*')
        .eq('pet_id', pet.id)
        .eq('matched_pet_id', userPetId)
        .eq('status', 'pending');

      if (existingMatch && existingMatch.length > 0) {
        // Update the match to accepted
        await supabase
          .from('matches')
          .update({ status: 'accepted' })
          .eq('id', existingMatch[0].id);

        toast({
          title: "It's a match!",
          description: `You and ${pet.name} liked each other!`,
        });
      } else {
        // Create a new pending match
        await supabase
          .from('matches')
          .insert({
            pet_id: userPetId,
            matched_pet_id: pet.id,
            status: 'pending'
          });

        // Show a match notification randomly (for demonstration purposes)
        if (Math.random() > 0.7) {
          toast({
            title: "It's a match!",
            description: `You and ${pet.name} liked each other!`,
          });
          
          // If it's a match, update the status to accepted
          await supabase
            .from('matches')
            .update({ status: 'accepted' })
            .eq('pet_id', userPetId)
            .eq('matched_pet_id', pet.id);
        }
      }
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        title: "Error",
        description: "Failed to create match. Please try again later.",
        variant: "destructive",
      });
    }
    
    // Remove the current pet from the view
    setTimeout(() => {
      removeCurrentPet();
    }, 500);
  };

  const handleSwipeLeft = (pet: Pet) => {
    console.log("Skipped:", pet.name);
    setTimeout(() => {
      removeCurrentPet();
    }, 500);
  };

  const removeCurrentPet = () => {
    setCurrentPets(prev => {
      const newPets = [...prev];
      newPets.shift();
      if (newPets.length === 0) {
        setNoMorePets(true);
      }
      return newPets;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Discover Pets</h1>
          
          {locationError && (
            <Alert className="mb-4">
              <AlertDescription>
                {locationError}. Showing all pets instead of nearby ones.
              </AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-pulse text-petpals-purple">Loading...</div>
            </div>
          ) : noMorePets || currentPets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No more pets to discover</h3>
              <p className="text-gray-600 mb-6">
                You've seen all the available pets in your area. Check back later for more!
              </p>
              <button 
                onClick={() => navigate("/matches")}
                className="bg-petpals-purple hover:bg-petpals-purple/90 text-white font-bold py-2 px-6 rounded-full"
              >
                View Your Matches
              </button>
            </div>
          ) : (
            <div className="relative h-[500px]">
              {currentPets.map((pet, index) => (
                <div 
                  key={pet.id} 
                  className={`absolute top-0 left-0 right-0 ${index === 0 ? "z-10" : "z-0"}`}
                  style={{ display: index === 0 ? "block" : "none" }}
                >
                  <PetCard
                    pet={pet}
                    onSwipeRight={handleSwipeRight}
                    onSwipeLeft={handleSwipeLeft}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;
