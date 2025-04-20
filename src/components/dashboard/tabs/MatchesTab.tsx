
import { MatchesList } from "../MatchesList";
import { useDashboard } from "@/contexts/DashboardContext";

export const MatchesTab = () => {
  const { matches, isLoadingMatches } = useDashboard();

  return <MatchesList matches={matches} isLoading={isLoadingMatches} />;
};
