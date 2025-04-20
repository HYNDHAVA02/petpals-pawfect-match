import { useEffect } from "react";
import { Pet } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MatchesOverviewProps {
  matches: Pet[];
  onMatchesUpdate: () => void;
}

export const MatchesOverview = ({ matches, onMatchesUpdate }: MatchesOverviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
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
          onMatchesUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onMatchesUpdate]);

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
                <div key={match.id} className="flex items-center gap-4 mb-3">
                  <img
                    src={match.imageUrl}
                    alt={match.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{match.name}</h3>
                    <p className="text-xs text-gray-500">
                      Owner: {match.ownerName}
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
