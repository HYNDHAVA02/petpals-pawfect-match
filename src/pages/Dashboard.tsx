
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { mockUserPets, mockMatches } from "@/data/mockData";
import { Pet } from "@/components/PetCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userPets, setUserPets] = useState<Pet[]>(mockUserPets);
  const [matches, setMatches] = useState<Pet[]>(mockMatches);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pets">Your Pets</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Pet Profiles</CardTitle>
                    <CardDescription>
                      Manage your pet profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userPets.length > 0 ? (
                        userPets.map(pet => (
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Matches & Messages</CardTitle>
                    <CardDescription>
                      Your recent connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {matches.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            You have {matches.length} matches
                          </p>
                          {matches.slice(0, 2).map(match => (
                            <div key={match.id} className="flex items-center gap-4 mb-3">
                              <img 
                                src={match.imageUrl} 
                                alt={match.name}
                                className="w-10 h-10 object-cover rounded-full"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-sm">{match.name}</h3>
                                <p className="text-xs text-gray-500">Owner: {match.ownerName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No matches yet</p>
                      )}
                      
                      <Button 
                        onClick={() => navigate("/matches")}
                        variant="outline" 
                        className="w-full"
                      >
                        View All Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>
                    Your recent activity on PetPals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        Welcome to PetPals! Start by creating pet profiles, then discover and match with other pets in your area.
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
            </TabsContent>
            
            <TabsContent value="pets">
              <Card>
                <CardHeader>
                  <CardTitle>Your Pets</CardTitle>
                  <CardDescription>
                    Manage your pet profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userPets.length > 0 ? (
                      userPets.map(pet => (
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
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="destructive" size="sm">Delete</Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">
                                {pet.breed}, {pet.age} years, {pet.gender === "male" ? "Male" : "Female"}
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
              </Card>
            </TabsContent>
            
            <TabsContent value="matches">
              <Card>
                <CardHeader>
                  <CardTitle>Your Matches</CardTitle>
                  <CardDescription>
                    Pets you've matched with
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {matches.length > 0 ? (
                      matches.map(match => (
                        <div key={match.id} className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex flex-col md:flex-row gap-4 items-start">
                            <img 
                              src={match.imageUrl} 
                              alt={match.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="font-bold text-lg">{match.name}</h3>
                                <Button 
                                  size="sm"
                                  className="bg-petpals-purple hover:bg-petpals-purple/90 mt-2 md:mt-0"
                                >
                                  Message
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">
                                {match.breed}, {match.age} years, {match.gender === "male" ? "Male" : "Female"}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">Owner: {match.ownerName}</p>
                              <p className="text-sm text-gray-600">{match.bio}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't matched with any pets yet</p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => navigate("/discover")}
                      className="w-full bg-petpals-purple hover:bg-petpals-purple/90"
                    >
                      Discover More Pets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
