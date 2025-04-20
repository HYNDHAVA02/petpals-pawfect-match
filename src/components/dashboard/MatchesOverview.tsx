
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MatchedPets } from "@/types/match";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MatchesOverviewProps {
  matches: MatchedPets[];
  onMatchesUpdate: () => void;
}

export const MatchesOverview = ({ matches, onMatchesUpdate }: MatchesOverviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for matches
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
          console.log('Matches updated, refreshing...');
          onMatchesUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onMatchesUpdate]);

  console.log('Matches in MatchesOverview:', matches);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches & Messages</CardTitle>
        <CardDescription>Your recent connections</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                You have {matches.length} matches
              </p>
              {matches.slice(0, 2).map((match) => (
                <div key={match.match_id} className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">🐾</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{match.pet1_name} & {match.pet2_name}</h3>
                    <p className="text-xs text-gray-500">
                      Matched on {new Date(match.match_created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No matches yet</p>
          )}

          <Button onClick={() => navigate("/matches")} variant="outline" className="w-full">
            View All Matches
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
