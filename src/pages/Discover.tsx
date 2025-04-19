
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import PetCard, { Pet } from "@/components/PetCard";
import { mockPets } from "@/data/mockData";

const Discover = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [noMorePets, setNoMorePets] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Load initial pet data
    setCurrentPets(mockPets);
    setLoading(false);
  }, [user, navigate]);

  const handleSwipeRight = (pet: Pet) => {
    console.log("Liked:", pet.name);
    
    // In a real app, we would send this to the backend
    setTimeout(() => {
      // Show a random match about 30% of the time for demo purposes
      if (Math.random() > 0.7) {
        toast({
          title: "It's a match!",
          description: `You and ${pet.name} liked each other!`,
        });
      }
      
      removeCurrentPet();
    }, 500);
  };

  const handleSwipeLeft = (pet: Pet) => {
    console.log("Skipped:", pet.name);
    setTimeout(() => {
      removeCurrentPet();
    }, 500);
  };

  const removeCurrentPet = () => {
    setCurrentPets(prev => {
      const newPets = [...prev];
      newPets.shift();
      if (newPets.length === 0) {
        setNoMorePets(true);
      }
      return newPets;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Discover Pets</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-pulse text-petpals-purple">Loading...</div>
            </div>
          ) : noMorePets || currentPets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">No more pets to discover</h3>
              <p className="text-gray-600 mb-6">
                You've seen all the available pets in your area. Check back later for more!
              </p>
              <button 
                onClick={() => navigate("/matches")}
                className="bg-petpals-purple hover:bg-petpals-purple/90 text-white font-bold py-2 px-6 rounded-full"
              >
                View Your Matches
              </button>
            </div>
          ) : (
            <div className="relative h-[500px]">
              {currentPets.map((pet, index) => (
                <div 
                  key={pet.id} 
                  className={`absolute top-0 left-0 right-0 ${index === 0 ? "z-10" : "z-0"}`}
                  style={{ display: index === 0 ? "block" : "none" }}
                >
                  <PetCard
                    pet={pet}
                    onSwipeRight={handleSwipeRight}
                    onSwipeLeft={handleSwipeLeft}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;
