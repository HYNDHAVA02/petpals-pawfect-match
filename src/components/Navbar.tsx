
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-petpals-purple to-petpals-pink">
            PetPals
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/discover" className="text-gray-700 hover:text-petpals-purple transition-colors">
                Discover
              </Link>
              <Link to="/matches" className="text-gray-700 hover:text-petpals-purple transition-colors">
                Matches
              </Link>
              <Link to="/pet-profile" className="text-gray-700 hover:text-petpals-purple transition-colors">
                My Pets
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-petpals-purple transition-colors">
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="py-3 px-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/discover"
                  className="block py-2 text-gray-700 hover:text-petpals-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discover
                </Link>
                <Link
                  to="/matches"
                  className="block py-2 text-gray-700 hover:text-petpals-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Matches
                </Link>
                <Link
                  to="/pet-profile"
                  className="block py-2 text-gray-700 hover:text-petpals-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Pets
                </Link>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-700 hover:text-petpals-purple"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link
                  to="/signup"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
