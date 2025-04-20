
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Pet } from "@/components/PetCard";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Pet[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Pet | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleChatClick = (pet: Pet) => {
    setSelectedMatch(pet);
    setChatOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: "Message sent!",
      description: "Your message has been sent.",
    });
    
    setChatMessage("");
    // In a real app, we would send this to the backend via WebSocket or AppSync GraphQL
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
      
      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMatch && (
                <>
                  <img 
                    src={selectedMatch.imageUrl}
                    alt={selectedMatch.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>Chat with {selectedMatch.name}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedMatch && `Owner: ${selectedMatch.ownerName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 rounded p-3 h-60 mb-4 overflow-y-auto">
            <div className="text-center text-gray-500 text-sm p-3">
              Start chatting with {selectedMatch?.name}'s owner to arrange a playdate!
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-petpals-purple hover:bg-petpals-purple/90"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;
