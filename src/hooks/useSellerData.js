// src/hooks/useSellerData.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useSellerData(idSeller) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idSeller) {
      setLoading(false);
      return;
    }

    async function fetchSeller() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .eq('id_seller', idSeller)
          .single();

        if (error) throw error;
        setSeller(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching seller:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSeller();
  }, [idSeller]);

  return { seller, loading, error };
}
