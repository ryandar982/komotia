// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('v_buyer_dashboard')
          .select('*')
          .eq('id_user', userId)
          .single();

        if (error) throw error;
        
        // Format the data to match expected frontend structure if needed, 
        // or just return the raw view data
        setUserData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  return { userData, loading, error };
}
