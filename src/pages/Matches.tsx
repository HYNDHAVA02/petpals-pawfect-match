
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Pet } from "@/components/PetCard";
import { useToast } from "@/hooks/use-toast";
import ChatDialog from "@/components/chat/ChatDialog";
import ErrorDialog from "@/components/common/ErrorDialog";
import { Button } from "@/components/ui/button";

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Pet[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Pet | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        // First, get the user's pets
        const { data: userPets, error: userPetsError } = await supabase
          .from('pets')
          .select('id')
          .eq('owner_id', user.id);

        if (userPetsError) throw userPetsError;
        if (!userPets || userPets.length === 0) {
          setLoading(false);
          return;
        }

        const userPetIds = userPets.map(pet => pet.id);

        // Get matches for any of the user's pets
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .in('pet_id', userPetIds)
          .eq('status', 'accepted');

        if (matchesError) throw matchesError;

        // Also get matches where the user's pet is the matched_pet_id
        const { data: matchesData2, error: matchesError2 } = await supabase
          .from('matches')
          .select('*')
          .in('matched_pet_id', userPetIds)
          .eq('status', 'accepted');

        if (matchesError2) throw matchesError2;

        // Combine both match sets
        const allMatches = [...(matchesData || []), ...(matchesData2 || [])];
        
        if (allMatches.length === 0) {
          setLoading(false);
          return;
        }

        // Get the pets that matched with the user's pets
        const matchedPetIds = allMatches.map(match => 
          userPetIds.includes(match.pet_id) ? match.matched_pet_id : match.pet_id
        );

        // Fetch the matched pets' details
        const { data: matchedPets, error: matchedPetsError } = await supabase
          .from('pets')
          .select(`
            *,
            profiles:owner_id(full_name)
          `)
          .in('id', matchedPetIds);

        if (matchedPetsError) throw matchedPetsError;

        // Format pets for the MatchCard component
        const formattedMatches: Pet[] = (matchedPets || []).map(pet => ({
          id: pet.id,
          name: pet.name,
          age: pet.age,
          breed: pet.breed,
          gender: pet.gender as "male" | "female",
          bio: pet.bio || "",
          imageUrl: pet.image_url || "/placeholder.svg",
          ownerId: pet.owner_id,
          ownerName: pet.profiles?.full_name || "Pet Owner"
        }));

        setMatches(formattedMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast({
          title: "Error",
          description: "Failed to load matches. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, navigate, toast]);

  const findMatchId = async (petId: string) => {
    if (!user) return null;

    try {
      // Get user's pets
      const { data: userPets, error: userPetsError } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', user.id);

      if (userPetsError) throw userPetsError;
      if (!userPets || userPets.length === 0) return null;

      const userPetIds = userPets.map(pet => pet.id);

      // Look for match where user's pet is pet_id and selected pet is matched_pet_id
      const { data: match1, error: match1Error } = await supabase
        .from('matches')
        .select('id')
        .in('pet_id', userPetIds)
        .eq('matched_pet_id', petId)
        .eq('status', 'accepted')
        .maybeSingle();

      if (match1Error) throw match1Error;
      if (match1) return match1.id;

      // Look for match where user's pet is matched_pet_id and selected pet is pet_id
      const { data: match2, error: match2Error } = await supabase
        .from('matches')
        .select('id')
        .eq('pet_id', petId)
        .in('matched_pet_id', userPetIds)
        .eq('status', 'accepted')
        .maybeSingle();

      if (match2Error) throw match2Error;
      if (match2) return match2.id;

      return null;
    } catch (error) {
      console.error("Error finding match ID:", error);
      return null;
    }
  };

  const handleChatClick = async (pet: Pet) => {
    setSelectedMatch(pet);
    
    const foundMatchId = await findMatchId(pet.id);
    if (foundMatchId) {
      setMatchId(foundMatchId);
      setChatOpen(true);
    } else {
      setErrorMessage("Could not find a valid match. Please try again later.");
      setErrorDialogOpen(true);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse text-petpals-purple">Loading matches...</div>
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard 
                  key={match.id}
                  pet={match}
                  onChatClick={handleChatClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No matches yet</h3>
              <p className="text-gray-600 mb-6">
                Start swiping to find matches for your pet!
              </p>
              <Button 
                onClick={() => navigate("/discover")}
                className="bg-petpals-purple hover:bg-petpals-purple/90"
              >
                Discover Pets
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <ChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        selectedMatch={selectedMatch}
        matchId={matchId}
        userId={user?.id}
      />

      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        message={errorMessage}
      />
    </div>
  );
};

export default Matches;
