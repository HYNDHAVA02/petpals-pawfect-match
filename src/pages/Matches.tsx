
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Pet } from "@/components/PetCard";
import { useToast } from "@/hooks/use-toast";
import ChatDialog from "@/components/chat/ChatDialog";
import ErrorDialog from "@/components/common/ErrorDialog";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { EmptyMatches } from "@/components/matches/EmptyMatches";
import { MatchesGrid } from "@/components/matches/MatchesGrid";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";

const MatchesContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, isLoadingMatches, handleMatchesUpdate } = useDashboard();
  const { loading, setLoading, matchId, setMatchId, errorMessage, setErrorMessage, findMatchId } = useMatchDetails(user?.id);
  const [selectedMatch, setSelectedMatch] = useState<Pet | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(false);

    // Initialize real-time subscription for matches
    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          handleMatchesUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, handleMatchesUpdate, navigate, setLoading]);

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
          
          {loading || isLoadingMatches ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-pulse text-petpals-purple">Loading matches...</div>
            </div>
          ) : matches.length > 0 ? (
            <MatchesGrid matches={matches} onChatClick={handleChatClick} />
          ) : (
            <EmptyMatches />
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

const Matches = () => {
  return (
    <DashboardProvider>
      <MatchesContent />
    </DashboardProvider>
  );
};

export default Matches;
