
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const usePets = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ['pets', ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', ownerId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!ownerId,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pet: Database['public']['Tables']['pets']['Insert']) => {
      const { data, error } = await supabase
        .from('pets')
        .insert(pet)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets', variables.owner_id] });
    },
  });
};

export const useMatches = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        console.log('Fetching matches for user:', userId);
        
        // First, get the user's pets
        const { data: userPets, error: petsError } = await supabase
          .from('pets')
          .select('id')
          .eq('owner_id', userId);
        
        if (petsError) {
          console.error('Error fetching user pets:', petsError);
          throw petsError;
        }
        
        if (!userPets || userPets.length === 0) {
          console.log('User has no pets');
          return [];
        }
        
        const petIds = userPets.map(pet => pet.id);
        console.log('User pet IDs:', petIds);
        
        // Get matches where user's pet is pet_id
        const { data: matches1, error: matches1Error } = await supabase
          .from('matches')
          .select(`
            *,
            pet:pets!pet_id(*),
            matched_pet:pets!matched_pet_id(*)
          `)
          .in('pet_id', petIds)
          .eq('status', 'accepted');
        
        if (matches1Error) {
          console.error('Error fetching matches (user pet as pet_id):', matches1Error);
          throw matches1Error;
        }
        
        // Get matches where user's pet is matched_pet_id
        const { data: matches2, error: matches2Error } = await supabase
          .from('matches')
          .select(`
            *,
            pet:pets!pet_id(*),
            matched_pet:pets!matched_pet_id(*)
          `)
          .in('matched_pet_id', petIds)
          .eq('status', 'accepted');
        
        if (matches2Error) {
          console.error('Error fetching matches (user pet as matched_pet_id):', matches2Error);
          throw matches2Error;
        }
        
        // Combine both sets of matches
        const allMatches = [...(matches1 || []), ...(matches2 || [])];
        console.log('Total matches found:', allMatches.length);
        
        return allMatches;
      } catch (error) {
        console.error('Error in useMatches hook:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (match: Database['public']['Tables']['matches']['Insert']) => {
      const { data, error } = await supabase
        .from('matches')
        .insert(match)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};
