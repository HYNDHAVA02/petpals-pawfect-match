
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
import { useState } from "react";
import { DeletePetDialog } from "./DeletePetDialog";

interface PetsListProps {
  userPets: Pet[];
  isLoadingPets: boolean;
  onPetsUpdate: () => void;
}

export const PetsList = ({ userPets, isLoadingPets, onPetsUpdate }: PetsListProps) => {
  const navigate = useNavigate();
  const [petToDelete, setPetToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleEdit = (petId: string) => {
    navigate(`/pet-profile/edit/${petId}`);
  };

  const handleDelete = (pet: Pet) => {
    setPetToDelete({ id: pet.id, name: pet.name });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Pets</CardTitle>
        <CardDescription>Manage your pet profiles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoadingPets ? (
            <p className="text-gray-500">Loading your pets...</p>
          ) : userPets.length > 0 ? (
            userPets.map((pet) => (
              <div key={pet.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <img
                    src={pet.imageUrl}
                    alt={pet.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{pet.name}</h3>
                      <div className="space-x-2 mt-2 md:mt-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(pet.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(pet)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {pet.breed}, {pet.age} years,{" "}
                      {pet.gender === "male" ? "Male" : "Female"}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{pet.bio}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't added any pets yet</p>
            </div>
          )}

          <Button
            onClick={() => navigate("/pet-profile")}
            className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
          >
            {userPets.length > 0 ? "Add Another Pet" : "Add Your First Pet"}
          </Button>
        </div>
      </CardContent>

      {petToDelete && (
        <DeletePetDialog
          isOpen={!!petToDelete}
          onOpenChange={(isOpen) => {
            if (!isOpen) setPetToDelete(null);
          }}
          petId={petToDelete.id}
          petName={petToDelete.name}
          onPetDeleted={onPetsUpdate}
        />
      )}
    </Card>
  );
};
