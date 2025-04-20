
import { MatchedPets } from "@/types/match";
import MatchCard from "@/components/MatchCard";

interface MatchesGridProps {
  matches: MatchedPets[];
  onChatClick: (matchId: string) => void;
}

export const MatchesGrid = ({ matches, onChatClick }: MatchesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard 
          key={match.match_id}
          match={match}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
};
