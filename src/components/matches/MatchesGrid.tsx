
import { Pet } from "@/components/PetCard";
import MatchCard from "@/components/MatchCard";

interface MatchesGridProps {
  matches: Pet[];
  onChatClick: (pet: Pet) => void;
}

export const MatchesGrid = ({ matches, onChatClick }: MatchesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard 
          key={match.id}
          pet={match}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
};
