// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient'; // Sesuaikan path koneksi Supabase

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Kembalikan data yang dibutuhkan oleh komponen
  return { products, loading, error };
}