
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

interface PetOverviewProps {
  userPets: Pet[];
  isLoadingPets: boolean;
}

export const PetOverview = ({ userPets, isLoadingPets }: PetOverviewProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pet Profiles</CardTitle>
        <CardDescription>Manage your pet profiles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoadingPets ? (
            <p className="text-gray-500">Loading your pets...</p>
          ) : userPets.length > 0 ? (
            userPets.map((pet) => (
              <div key={pet.id} className="flex items-center gap-4">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <h3 className="font-medium">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pets added yet</p>
          )}

          <Button
            onClick={() => navigate("/pet-profile")}
            className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          >
            {userPets.length > 0 ? "Add Another Pet" : "Add Your First Pet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
