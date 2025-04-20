
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const EmptyMatches = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Matches</CardTitle>
        <CardDescription>You haven't matched with any pets yet</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-6">
        <p className="text-gray-500 mb-6">Start discovering pets to find matches!</p>
        <Button onClick={() => navigate("/discover")} className="bg-petpals-purple hover:bg-petpals-purple/90">
          Discover Pets
        </Button>
      </CardContent>
    </Card>
  );
};
