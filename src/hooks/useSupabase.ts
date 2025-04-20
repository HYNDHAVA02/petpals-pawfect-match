
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';
import { MatchedPets } from '@/types/match';

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
        
        // Use rpc to create a custom SQL query or use a raw SQL query for the view
        // since TypeScript definitions don't recognize views
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id,
            status,
            created_at,
            pet:pet_id (
              id,
              name,
              breed,
              age,
              owner_id,
              owner_name
            ),
            matched_pet:matched_pet_id (
              id,
              name,
              breed,
              age,
              owner_id,
              owner_name
            )
          `);
        
        if (error) {
          console.error('Error fetching matches:', error);
          throw error;
        }
        
        // Transform the data to match the MatchedPets type
        const transformedData = (data || []).map(match => ({
          match_id: match.id,
          status: match.status,
          match_created_at: match.created_at,
          pet1_id: match.pet?.id || '',
          pet1_name: match.pet?.name || '',
          pet1_breed: match.pet?.breed || '',
          pet1_age: match.pet?.age || 0,
          pet1_owner_name: match.pet?.owner_name || '',
          pet2_id: match.matched_pet?.id || '',
          pet2_name: match.matched_pet?.name || '',
          pet2_breed: match.matched_pet?.breed || '',
          pet2_age: match.matched_pet?.age || 0,
          pet2_owner_name: match.matched_pet?.owner_name || ''
        })) as MatchedPets[];
        
        return transformedData;
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
