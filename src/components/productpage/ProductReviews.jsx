import React, { useState, useEffect } from 'react';
import './ProductReviews.css';
import { supabase } from '../../config/supabaseClient';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    async function fetchReviews() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            users (nama, username, avatar_url)
          `)
          .eq('id_product', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.error('Error fetching product reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  // Hitung summary
  const totalReviews = reviews.length;
  const sumRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating = totalReviews > 0 ? (sumRating / totalReviews) : 0;
  
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rating = Math.round(r.rating);
    if (rating >= 1 && rating <= 5) {
      ratingBreakdown[rating]++;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const renderStars = (rating, size = 'normal') => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`pr-star ${i < Math.round(rating) ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  // Tampilkan 5 review awal, sisanya di-toggle
  const INITIAL_COUNT = 5;
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);

  if (loading) {
    return (
      <div className="pr-section">
        <h2 className="pr-title">Ulasan Pembeli</h2>
        <div className="pr-empty">
          <p>Memuat ulasan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-section">
      <h2 className="pr-title">Ulasan Pembeli</h2>

      {totalReviews > 0 ? (
        <>
          {/* Summary */}
          <div className="pr-summary">
            <div className="pr-avg-rating">
              <div className="pr-avg-number">{averageRating.toFixed(1)}</div>
              <div className="pr-avg-stars">
                {renderStars(averageRating)}
              </div>
              <div className="pr-avg-sub">{totalReviews} ulasan</div>
            </div>

            <div className="pr-bars">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingBreakdown[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div className="pr-bar-row" key={star}>
                    <div className="pr-bar-label">
                      {star} <span className="pr-star filled">★</span>
                    </div>
                    <div className="pr-bar-track">
                      <div className="pr-bar-fill" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="pr-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review List */}
          <div className="pr-list">
            {displayedReviews.map((review, idx) => {
              const reviewerName = review.users?.nama || review.users?.username || 'Anonim';
              const reviewerAvatar = review.users?.avatar_url;

              return (
                <div className="pr-item" key={review.id_review || idx}>
                  <div className="pr-item-header">
                    {reviewerAvatar ? (
                      <img 
                        src={reviewerAvatar} 
                        alt={reviewerName} 
                        className="pr-avatar"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.style.display = 'none'; 
                        }}
                      />
                    ) : (
                      <div className="pr-avatar">
                        {getInitials(reviewerName)}
                      </div>
                    )}
                    <div className="pr-reviewer-info">
                      <p className="pr-reviewer-name">{reviewerName}</p>
                      <p className="pr-review-date">{formatDate(review.created_at)}</p>
                    </div>
                  </div>

                  <div className="pr-item-stars">
                    {renderStars(review.rating)}
                  </div>

                  {review.komentar && (
                    <p className="pr-comment">{review.komentar}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show More / Less */}
          {reviews.length > INITIAL_COUNT && (
            <button 
              className="pr-show-more" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll 
                ? 'Sembunyikan Ulasan' 
                : `Lihat Semua Ulasan (${reviews.length})`
              }
            </button>
          )}
        </>
      ) : (
        <div className="pr-empty">
          <div className="pr-empty-icon">📝</div>
          <h3 className="pr-empty-title">Belum ada ulasan</h3>
          <p className="pr-empty-text">Jadilah yang pertama memberikan ulasan untuk produk ini!</p>
        </div>
      )}
    </div>
  );
}
