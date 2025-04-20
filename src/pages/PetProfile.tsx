
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import PetProfileForm from "@/components/PetProfileForm";
import { useCreatePet } from "@/hooks/useSupabase";

const PetProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createPet } = useCreatePet();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Format and insert new pet data into the pets table
      // This creates a new pet profile in the database
      const petData = {
        name: formData.name,
        age: parseFloat(formData.age),
        breed: formData.breed,
        gender: formData.gender,
        bio: formData.bio,
        image_url: formData.imageUrl,
        owner_id: user.id,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude
      };
      
      await createPet(petData);
      
      toast({
        title: "Success!",
        description: "Pet profile has been saved",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving pet profile:", error);
      toast({
        title: "Error",
        description: "Failed to save pet profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">
              Create Your Pet's Profile
            </h1>
            
            <PetProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetProfile;
