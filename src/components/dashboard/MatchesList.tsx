
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MatchedPets } from "@/types/match";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MatchesListProps {
  matches: MatchedPets[];
  isLoading?: boolean;
}

export const MatchesList = ({ matches, isLoading }: MatchesListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Matches</CardTitle>
          <CardDescription>Loading matches...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Matches</CardTitle>
        <CardDescription>Pets you've matched with</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.match_id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🐾</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{match.pet1_name} & {match.pet2_name}</h3>
                        <p className="text-sm text-gray-500">Match established</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-petpals-purple hover:bg-petpals-purple/90 mt-2 md:mt-0"
                        onClick={() => navigate(`/matches?match=${match.match_id}`)}
                      >
                        Message
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {match.pet1_breed}, {match.pet1_age} years
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Owner: {match.pet1_owner_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {match.pet2_breed}, {match.pet2_age} years
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Owner: {match.pet2_owner_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You haven't matched with any pets yet
              </p>
            </div>
          )}

          <Button
            onClick={() => navigate("/discover")}
            className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          >
            Discover More Pets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
