
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pet } from "./PetCard";

interface MatchCardProps {
  pet: Pet;
  onChatClick: (pet: Pet) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ pet, onChatClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={pet.imageUrl} 
            alt={pet.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-petpals-purple text-white border-none">
              Match!
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.breed}, {pet.age} years</p>
              {pet.location && (
                <p className="text-xs text-gray-500">{pet.location}</p>
              )}
              {pet.distance && (
                <p className="text-xs text-gray-500">{pet.distance}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{pet.bio}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Owner: {pet.ownerName}</span>
            <Button 
              size="sm" 
              className="bg-petpals-purple hover:bg-petpals-purple/90"
              onClick={() => onChatClick(pet)}
            >
              Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
