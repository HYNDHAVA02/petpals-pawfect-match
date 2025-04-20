
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ActivityOverview = () => {
  const navigate = useNavigate();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your recent activity on PetPals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Welcome to PetPals! Start by creating pet profiles, then discover and
              match with other pets in your area.
            </p>
          </div>

          <Button
            onClick={() => navigate("/discover")}
            className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          >
            Discover New Pets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
