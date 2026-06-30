// src/hooks/useUserReviews.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useUserReviews(userId) {
  const [waitingList, setWaitingList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchReviewsData() {
      try {
        setLoading(true);

        // Fetch waiting for review from v_waiting_review
        const { data: waitingData, error: waitingError } = await supabase
          .from('v_waiting_review')
          .select('*')
          .eq('id_user', userId);

        if (waitingError) throw waitingError;

        // Formating waiting data
        const formattedWaiting = (waitingData || []).map(item => ({
          productId: item.id_product,
          transactionId: item.id_transaction,
          detailId: item.id_detail,
          productName: item.nama_product,
          imageUrl: item.gambar_utama,
          orderCompletedDate: item.tanggal_transaksi, // Ideally should be completion date
          variant: "Standard" // Dummy for now
        }));
        
        setWaitingList(formattedWaiting);

        // Fetch history of reviews from reviews table joined with products
        const { data: historyData, error: historyError } = await supabase
          .from('reviews')
          .select(`
            *,
            products (nama_product, gambar_utama)
          `)
          .eq('id_user', userId)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;
        
        // Formatting history data
        const formattedHistory = (historyData || []).map(item => ({
          reviewId: item.id_review,
          productId: item.id_product,
          productName: item.products?.nama_product,
          imageUrl: item.products?.gambar_utama,
          variant: "Standard",
          rating: item.rating,
          reviewDate: item.created_at,
          reviewText: item.komentar
        }));
        
        setHistoryList(formattedHistory);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching user reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviewsData();
  }, [userId]);

  return { waitingList, historyList, loading, error };
}
