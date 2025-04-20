
import { MatchesList } from "../MatchesList";
import { useDashboard } from "@/contexts/DashboardContext";

export const MatchesTab = () => {
  const { matches } = useDashboard();

  return <MatchesList matches={matches} />;
};
