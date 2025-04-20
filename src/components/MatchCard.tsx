
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pet } from "./PetCard";
import { MatchedPets } from "@/types/match";

interface MatchCardProps {
  match: MatchedPets;
  onChatClick: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onChatClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute top-2 right-2">
            <Badge className="bg-petpals-purple text-white border-none">
              Match!
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{match.pet1_name}</h3>
                <p className="text-sm text-gray-600">
                  {match.pet1_breed}, {match.pet1_age} years
                </p>
                <p className="text-xs text-gray-500">Owner: {match.pet1_owner_name}</p>
              </div>
              <div className="text-center text-gray-400">
                matched with
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg">{match.pet2_name}</h3>
                <p className="text-sm text-gray-600">
                  {match.pet2_breed}, {match.pet2_age} years
                </p>
                <p className="text-xs text-gray-500">Owner: {match.pet2_owner_name}</p>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button 
                size="sm" 
                className="bg-petpals-purple hover:bg-petpals-purple/90"
                onClick={() => onChatClick(match.match_id)}
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
