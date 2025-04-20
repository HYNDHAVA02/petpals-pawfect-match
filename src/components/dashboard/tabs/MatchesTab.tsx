
import { MatchesList } from "../MatchesList";
import { useDashboard } from "@/contexts/DashboardContext";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export const MatchesTab = () => {
  const { matches, isLoadingMatches, handleMatchesUpdate } = useDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize real-time subscription for matches
    if (!user) return;

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
  }, [user, handleMatchesUpdate]);

  if (isLoadingMatches) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Matches</CardTitle>
          <CardDescription>Loading your matches...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Matches</CardTitle>
          <CardDescription>You haven't matched with any pets yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-6">
          <p className="text-gray-500 mb-6">Start discovering pets to find matches!</p>
          <Button onClick={() => navigate("/discover")} className="bg-petpals-purple hover:bg-petpals-purple/90">
            Discover Pets
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <MatchesList matches={matches} isLoading={isLoadingMatches} />;
};
