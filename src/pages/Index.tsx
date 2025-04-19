
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-petpals-purple to-petpals-pink">
          PetPals
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/discover")}
              className="bg-petpals-purple hover:bg-petpals-purple/90"
            >
              Go to App
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="bg-petpals-purple hover:bg-petpals-purple/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-petpals-light-purple to-white py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Find The Perfect 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-petpals-purple to-petpals-pink">
                    {" Playmate "}
                  </span>
                  For Your Pet
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Connect with other pet owners in your area. Create playdates, find furry friends, and build a community for you and your pet.
                </p>
                <Button
                  onClick={() => navigate(isAuthenticated ? "/discover" : "/signup")}
                  size="lg"
                  className="bg-petpals-purple hover:bg-petpals-purple/90 text-white px-8"
                >
                  {isAuthenticated ? "Start Matching" : "Join PetPals Today"}
                </Button>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-full bg-petpals-pink/20 overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1582562124811-c09040d0a901"
                    alt="Happy pets"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-petpals-yellow/30 backdrop-blur-sm"></div>
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-petpals-green/30 backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">How PetPals Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-petpals-light-purple flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🐾</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create a Profile</h3>
                <p className="text-gray-600">
                  Create a profile for your pet with photos and details about their personality.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-petpals-pink flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Swipe & Match</h3>
                <p className="text-gray-600">
                  Browse pet profiles in your area and swipe right on ones you'd like to meet.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-petpals-green flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Meet</h3>
                <p className="text-gray-600">
                  Chat with matches and arrange playdates in safe, pet-friendly locations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 bg-gradient-to-r from-petpals-purple/10 to-petpals-pink/10">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Pet's New Best Friend?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of pet owners who have found perfect playmates for their furry friends.
            </p>
            <Button
              onClick={() => navigate(isAuthenticated ? "/discover" : "/signup")}
              size="lg"
              className="bg-petpals-purple hover:bg-petpals-purple/90 text-white px-8"
            >
              {isAuthenticated ? "Find Matches" : "Get Started for Free"}
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-petpals-purple to-petpals-pink mb-4 md:mb-0">
              PetPals
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 PetPals. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
