// src/hooks/useSellerProducts.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';

export function useSellerProducts(idSeller) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerProducts = useCallback(async () => {
    if (!idSeller) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id_seller', idSeller);

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching seller products:', err);
    } finally {
      setLoading(false);
    }
  }, [idSeller]);

  useEffect(() => {
    fetchSellerProducts();
  }, [fetchSellerProducts]);

  return { products, loading, error, refetchProducts: fetchSellerProducts };
}
