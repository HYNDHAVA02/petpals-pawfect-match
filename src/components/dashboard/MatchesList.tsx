
import { Pet } from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MatchesListProps {
  matches: Pet[];
}

export const MatchesList = ({ matches }: MatchesListProps) => {
  const navigate = useNavigate();

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
              <div key={match.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <img
                    src={match.imageUrl}
                    alt={match.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{match.name}</h3>
                      <Button
                        size="sm"
                        className="bg-petpals-purple hover:bg-petpals-purple/90 mt-2 md:mt-0"
                      >
                        Message
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {match.breed}, {match.age} years,{" "}
                      {match.gender === "male" ? "Male" : "Female"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Owner: {match.ownerName}
                    </p>
                    <p className="text-sm text-gray-600">{match.bio}</p>
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
