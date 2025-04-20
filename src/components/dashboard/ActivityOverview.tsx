
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ActivityOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleMatchesUpdate } = useDashboard();
  const [hasRecentActivity, setHasRecentActivity] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for matches and messages
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
        },
        () => {
          console.log('Match activity updated');
          handleMatchesUpdate();
          setHasRecentActivity(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          console.log('Message activity updated');
          setHasRecentActivity(true);
        }
      )
      .subscribe();

    return () => {
      // Clean up realtime subscription
      supabase.removeChannel(channel);
    };
  }, [user, handleMatchesUpdate]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your recent activity on PetPals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            {hasRecentActivity ? (
              <p className="text-gray-600">
                You have new activity! Check your matches and messages.
              </p>
            ) : (
              <p className="text-gray-600">
                Welcome to PetPals! Start by creating pet profiles, then discover and
                match with other pets in your area.
              </p>
            )}
          </div>

          <Button
            onClick={() => navigate("/discover")}
            className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          >
            Discover New Pets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
