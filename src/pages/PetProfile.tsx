
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import PetProfileForm from "@/components/PetProfileForm";
import { mockUserPets } from "@/data/mockData";

const PetProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call to create or update pet profile
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Pet profile has been saved",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pet profile",
        variant: "destructive",
      });
      console.error("Error saving pet profile:", error);
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
              {mockUserPets.length > 0 ? "Add Another Pet" : "Create Your Pet's Profile"}
            </h1>
            
            <PetProfileForm onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetProfile;
