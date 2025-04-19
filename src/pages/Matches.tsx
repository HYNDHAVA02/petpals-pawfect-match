
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Pet } from "@/components/PetCard";
import { mockMatches } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Matches = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Pet[]>(mockMatches);
  const [selectedMatch, setSelectedMatch] = useState<Pet | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
          
          {matches.length > 0 ? (
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
