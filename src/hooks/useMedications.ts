import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

/**
 * Hook to fetch user's medications from database
 */
export const useMedications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_medications')
        .select('*')
        .eq('user_id', user.id)
        .order('added_date', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match expected format
      return data.map(med => ({
        id: med.medication_id,
        name: med.medication_name,
        addedDate: med.added_date,
      }));
    },
    enabled: !!user,
  });
};

/**
 * Hook to save user's medications
 */
export const useSaveMedications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (medications: Array<{ id: string; name: string; addedDate: string }>) => {
      if (!user) throw new Error('Not authenticated');
      
      // Delete existing medications
      await supabase
        .from('user_medications')
        .delete()
        .eq('user_id', user.id);
      
      // Insert new medications
      if (medications.length > 0) {
        const { data, error } = await supabase
          .from('user_medications')
          .insert(
            medications.map(med => ({
              user_id: user.id,
              medication_id: med.id,
              medication_name: med.name,
              added_date: med.addedDate,
            }))
          )
          .select();
        
        if (error) throw error;
        return data;
      }
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: 'Sparat',
        description: 'Dina läkemedel har sparats',
      });
    },
    onError: (error) => {
      console.error('Error saving medications:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte spara läkemedel',
        variant: 'destructive',
      });
    },
  });
};
