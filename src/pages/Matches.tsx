
import { useState, useEffect, useRef } from "react";
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Pet[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Pet | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    // Scroll to bottom of message list when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Setup realtime subscription for new messages when a chat is open
    if (!chatOpen || !matchId || !user) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatOpen, matchId, user, toast]);

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

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !user || !matchId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: chatMessage.trim()
        });

      if (error) throw error;
      
      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm p-3">
                Start chatting with {selectedMatch?.name}'s owner to arrange a playdate!
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-2 rounded-lg max-w-[80%] ${
                      message.sender_id === user.id 
                        ? 'bg-petpals-purple text-white self-end rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'
                    }`}
                  >
                    <div>{message.content}</div>
                    <div className={`text-xs ${message.sender_id === user.id ? 'text-purple-100' : 'text-gray-500'} text-right`}>
                      {formatMessageTime(message.created_at)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
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

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unable to start chat</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <Button 
              onClick={() => setErrorDialogOpen(false)}
              className="bg-petpals-purple hover:bg-petpals-purple/90"
            >
              OK
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Matches;
