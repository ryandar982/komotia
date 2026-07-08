// src/hooks/useSellerReviews.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useSellerReviews(idSeller) {
  const [reviews, setReviews] = useState({ list: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idSeller) {
      setLoading(false);
      return;
    }

    async function fetchReviews() {
      try {
        setLoading(true);
        // Ambil list review
        const { data: listData, error: listError } = await supabase
          .from('reviews')
          .select('*')
          .eq('id_seller', idSeller)
          .order('created_at', { ascending: false });

        if (listError) throw listError;

        // Hitung summary secara manual di frontend dari list data
        // (Atau bisa pakai RPC if configured di Supabase)
        let totalReviews = listData ? listData.length : 0;
        let sumRating = 0;
        let ratingBreakdown = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };

        const formattedList = (listData || []).map(rev => {
            sumRating += rev.rating;
            ratingBreakdown[String(rev.rating)] += 1;
            
            return {
                id: rev.id_review,
                reviewerName: rev.reviewer_name,
                reviewerAvatar: rev.reviewer_avatar,
                rating: rev.rating,
                productId: rev.id_product,
                productBought: rev.product_bought,
                comment: rev.komentar,
                createdAt: rev.created_at
            };
        });

        const averageRating = totalReviews > 0 ? (sumRating / totalReviews) : 0;

        setReviews({
            list: formattedList,
            summary: {
                averageRating,
                totalReviews,
                ratingBreakdown
            }
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching seller reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [idSeller]);

  return { reviews, loading, error };
}
