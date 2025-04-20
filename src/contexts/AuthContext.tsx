
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsEmailVerification: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Reset email verification flag when user logs in
        if (event === 'SIGNED_IN') {
          setNeedsEmailVerification(false);
        }

        // Safe navigation that doesn't run on initial load
        if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
          navigate('/discover');
        } else if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle "Email not confirmed" error specifically
        if (error.message === "Email not confirmed") {
          setNeedsEmailVerification(true);
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account before logging in.",
            variant: "default",
          });
        } else {
          throw error;
        }
      }

    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      setNeedsEmailVerification(true);
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account",
      });

    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // First, check if we have a session before trying to sign out
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // If no session exists, just clear local state without calling signOut
        setUser(null);
        setSession(null);
        navigate('/');
        return;
      }

      // If we have a session, try to sign out properly
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If error is session not found, we still want to clear local state
        if (error.message.includes("session") && error.message.includes("not found")) {
          setUser(null);
          setSession(null);
          navigate('/');
          return;
        }
        throw error;
      }
    } catch (error: any) {
      // Only show toast for errors that aren't related to missing session
      if (!error.message.includes("session") || !error.message.includes("not found")) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // For session not found errors, just clear state and navigate
        setUser(null);
        setSession(null);
        navigate('/');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user,
      isLoading,
      needsEmailVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};
