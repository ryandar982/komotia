import React, { useState } from 'react';
import './UlasanPembeli.css';

export default function UlasanPembeli({ reviews }) {
  // State untuk filter berdasarkan rating bintang
  const [activeFilter, setActiveFilter] = useState('Semua');

  // Antisipasi jika data belum tersedia
  if (!reviews || !reviews.summary || !reviews.list) return null;

  const { summary, list } = reviews;

  // Fungsi memformat tanggal (contoh: 2026-03-30T10:30:00Z -> 30 Mar 2026, 10:30 WIB)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return `${date.toLocaleDateString('id-ID', options).replace('.', ':')} WIB`;
  };

  // Fungsi pembantu untuk merender bintang berdasarkan angka rating
  const renderStars = (rating) => {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '★'.repeat(5 - rating);
    return (
      <span className="up-stars-text">
        {fullStars}
        {emptyStars && <span className="up-star-empty">{emptyStars}</span>}
      </span>
    );
  };

  // Logika filter ulasan
  const filteredReviews = activeFilter === 'Semua' 
    ? list 
    : list.filter(review => review.rating === activeFilter);

  return (
    <div className="up-container">
      {/* Judul Halaman */}
      <div className="up-header">
        <h2 className="up-title">Ulasan Pembeli</h2>
      </div>

      <div className="up-layout">
        {/* Bagian Kiri: Ringkasan Rating Toko */}
        <div className="up-sidebar">
          <div className="up-rating-card">
            <h3 className="up-rating-title">Rating Toko <span className="up-icon-info">ⓘ</span></h3>
            <div className="up-rating-big-star">★</div>
            <div className="up-rating-score">
              <strong>{summary.averageRating.toFixed(1)}</strong> / 5.0
            </div>
            
            {/* Breakdown Bintang */}
            <div className="up-rating-breakdown">
              {[5, 4, 3, 2, 1].map((star) => (
                <div className="up-rating-row" key={`breakdown-${star}`}>
                  <span className="up-stars">{renderStars(star)}</span>
                  <span className="up-count">{summary.ratingBreakdown[star] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Filter & Daftar Ulasan */}
        <div className="up-main-content">
          {/* Dropdown & Filter */}
          <div className="up-filters">
            <select className="up-select">
              <option>30 Hari Terakhir</option>
              <option>Bulan Ini</option>
            </select>
            
            <select className="up-select">
              <option>Pilih Kategori</option>
              <option>Akun</option>
              <option>Item</option>
            </select>

            {/* Filter Pills Dinamis */}
            <div className="up-filter-pills">
              {['Semua', 5, 4, 3, 2, 1].map((filterVal) => (
                <button 
                  key={filterVal}
                  className={`up-pill ${activeFilter === filterVal ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filterVal)}
                >
                  {filterVal !== 'Semua' && <span className="up-star-icon">★</span>} {filterVal}
                </button>
              ))}
            </div>
          </div>

          {/* List Ulasan */}
          <div className="up-reviews-list">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div className="up-review-item" key={review.id}>
                  <div className="up-review-content">
                    <div className="up-review-header">
                      <span className="up-reviewer-name">{review.reviewerName}</span>
                      <span className="up-review-date">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="up-review-stars">
                      {renderStars(review.rating)}
                    </div>
                    <div className="up-review-product">
                      Varian: <strong>{review.productBought}</strong>
                    </div>
                    <p className="up-review-text">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Belum ada ulasan untuk filter ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}