
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockMatches } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches] = useState(mockMatches);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          <DashboardProvider matches={matches}>
            <DashboardTabs />
          </DashboardProvider>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
