import React, { useState } from 'react';
import './UserOrderHistory.css';
import { supabase } from '../../config/supabaseClient';

export default function UserOrderHistory({ data }) {
  const [filter, setFilter] = useState('Semua Pesanan');
  const [reviewModal, setReviewModal] = useState(null); // { item, orderId }
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewedItems, setReviewedItems] = useState(new Set());

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Normalisasi status agar konsisten dengan format yang digunakan seller
  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    const s = status.toLowerCase();
    if (s === 'pending' || s === 'perlu diproses' || s === 'menunggu konfirmasi') return 'pending';
    if (s === 'selesai' || s === 'pesanan selesai') return 'selesai';
    if (s === 'dibatalkan' || s === 'pesanan dibatalkan' || s === 'sedang dibatalkan') return 'dibatalkan';
    return s;
  };

  const filteredData = (data || []).filter(order => {
    if (filter === 'Semua Pesanan') return true;
    const normalized = normalizeStatus(order.status);
    if (filter === 'Pesanan Selesai' && normalized === 'selesai') return true;
    if (filter === 'Pesanan Dibatalkan' && normalized === 'dibatalkan') return true;
    return false;
  });

  const getStatusInfo = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'selesai': return { label: 'SELESAI', className: 'status-success' };
      case 'pending': return { label: 'PENDING', className: 'status-warning' };
      case 'dibatalkan': return { label: 'DIBATALKAN', className: 'status-danger' };
      default: return { label: (status || '').toUpperCase(), className: 'status-default' };
    }
  };

  const openReviewModal = (item, orderId) => {
    setReviewModal({ item, orderId });
    setReviewRating(0);
    setReviewHover(0);
    setReviewComment('');
  };

  const closeReviewModal = () => {
    setReviewModal(null);
    setReviewRating(0);
    setReviewHover(0);
    setReviewComment('');
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      alert('Silakan pilih rating bintang terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Ambil data user dari localStorage
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const reviewerName = savedUser.nama || savedUser.username || 'Anonim';
      const reviewerAvatar = savedUser.avatar_url || null;

      const reviewData = {
        id_product: parseInt(reviewModal.item.id_product),
        id_user: savedUser.id_user || null,
        rating: reviewRating,
        komentar: reviewComment.trim() || null,
        id_detail: reviewModal.item.id_detail || null
      };

      const { error } = await supabase
        .from('reviews')
        .upsert(reviewData, { onConflict: 'id_user, id_product' });

      if (error) throw error;

      alert('Ulasan berhasil dikirim! Terima kasih atas feedback Anda. 🎉');
      
      // Tandai item sudah di-review agar tombolnya berubah
      setReviewedItems(prev => {
        const updated = new Set(prev);
        updated.add(`${reviewModal.orderId}-${reviewModal.item.id_product}`);
        return updated;
      });

      closeReviewModal();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Gagal mengirim ulasan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="uoh-container">
      {/* HEADER SECTION */}
      <div className="uoh-header">
        <h2 className="uoh-title">Riwayat Pesanan</h2>
        <p className="uoh-subtitle">Pantau status dan detail belanjaan Anda di sini.</p>
      </div>

      {/* TABS SECTION */}
      <div className="uoh-tabs-container">
        <div className="uoh-tabs">
          {['Semua Pesanan', 'Pesanan Selesai', 'Pesanan Dibatalkan'].map(tab => (
            <button 
              key={tab}
              className={`uoh-tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>   

      {/* LIST SECTION */}
      <div className="uoh-list-container">
        {filteredData.length > 0 ? (
          filteredData.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const isSelesai = normalizeStatus(order.status) === 'selesai';
            
            return (
              <div key={order.id} className="uoh-order-card">
                
                {/* Card Header */}
                <div className="uoh-card-header">
                  <div className="uoh-order-info">
                    <span className="uoh-order-id">TRX-{order.id}</span>
                    <span className="uoh-order-date">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={`uoh-status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </div>
                </div>
                
                {/* Card Body: Items */}
                <div className="uoh-card-body">
                  {order.items.map(item => {
                    const reviewKey = `${order.id}-${item.id_product}`;
                    const alreadyReviewed = reviewedItems.has(reviewKey);

                    return (
                      <div key={item.id_detail} className="uoh-item-row">
                        <div className="uoh-item-image-wrapper">
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/80'} 
                            alt={item.productName} 
                            className="uoh-item-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
                          />
                        </div>
                        <div className="uoh-item-details">
                          <h4 className="uoh-item-name">{item.productName}</h4>
                          <p className="uoh-item-store">
                            <span className="store-icon">🏪</span> Toko: {item.storeName}
                          </p>
                          <div className="uoh-item-price-qty">
                            <span className="uoh-item-qty">{item.quantity} x</span>
                            <span className="uoh-item-price">{formatRupiah(item.price)}</span>
                          </div>
                        </div>

                        {/* Tombol Tulis Ulasan - hanya muncul pada pesanan selesai */}
                        {isSelesai && (
                          <div className="uoh-review-btn-wrapper">
                            {alreadyReviewed ? (
                              <span className="uoh-reviewed-badge">✓ Sudah Diulas</span>
                            ) : (
                              <button 
                                className="uoh-btn-review"
                                onClick={() => openReviewModal(item, order.id)}
                              >
                                ✍ Tulis Ulasan
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer */}
                <div className="uoh-card-footer">
                  <div className="uoh-footer-left">
                    {order.paymentMethod && <span className="uoh-payment-method">Via {order.paymentMethod}</span>}
                  </div>
                  <div className="uoh-footer-right">
                    <span className="uoh-total-label">Total Belanja: </span>
                    <span className="uoh-total-amount">{formatRupiah(order.totalAmount)}</span>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="uoh-empty-state">
            <div className="uoh-empty-icon">🛒</div>
            <h3 className="uoh-empty-title">Belum ada pesanan</h3>
            <p className="uoh-empty-text">Mulai belanja sekarang dan penuhi keranjangmu dengan produk terbaik!</p>
          </div>
        )}
      </div>

      {/* ===== REVIEW MODAL ===== */}
      {reviewModal && (
        <div className="uoh-review-overlay" onClick={closeReviewModal}>
          <div className="uoh-review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="uoh-review-modal-header">
              <h3>Tulis Ulasan</h3>
              <button className="uoh-review-close" onClick={closeReviewModal}>✕</button>
            </div>

            {/* Product Info */}
            <div className="uoh-review-product">
              <img 
                src={reviewModal.item.imageUrl || 'https://via.placeholder.com/60'} 
                alt={reviewModal.item.productName}
                className="uoh-review-product-img"
                onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
              />
              <div>
                <h4 className="uoh-review-product-name">{reviewModal.item.productName}</h4>
                <p className="uoh-review-product-store">🏪 Toko: {reviewModal.item.storeName}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="uoh-review-rating-section">
              <p className="uoh-review-rating-label">Bagaimana penilaian Anda?</p>
              <div className="uoh-review-stars-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`uoh-review-star ${star <= (reviewHover || reviewRating) ? 'active' : ''}`}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHover(star)}
                    onMouseLeave={() => setReviewHover(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="uoh-review-rating-text">
                {reviewRating === 1 && 'Sangat Buruk'}
                {reviewRating === 2 && 'Buruk'}
                {reviewRating === 3 && 'Cukup'}
                {reviewRating === 4 && 'Baik'}
                {reviewRating === 5 && 'Sangat Baik'}
              </p>
            </div>

            {/* Comment */}
            <div className="uoh-review-comment-section">
              <label className="uoh-review-comment-label">Komentar (opsional)</label>
              <textarea
                className="uoh-review-textarea"
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <span className="uoh-review-char-count">{reviewComment.length}/500</span>
            </div>

            {/* Submit Button */}
            <button 
              className="uoh-review-submit"
              onClick={handleSubmitReview}
              disabled={isSubmitting || reviewRating === 0}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}