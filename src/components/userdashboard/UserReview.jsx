import React from 'react';
import './UserReview.css';

export default function UserReview() {
  return (
    <div className="ur-container">
      {/* HEADER */}
      <div className="ur-header">
        <h2 className="ur-title">Ulasan Saya</h2>
      </div>

      {/* TABS */}
      <div className="ur-tabs-container">
        <div className="ur-tabs">
          <div className="ur-tab active">Menunggu Diulas</div>
          <div className="ur-tab">Riwayat Ulasan</div>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="ur-list">
        
        {/* CARD 1: Menunggu Diulas */}
        <div className="ur-card">
          <div className="ur-card-content">
            <div className="ur-product-info">
              <div className="ur-product-image">
                {/* Ganti dengan tag <img src="..." alt="..." /> nantinya */}
                <span className="ur-img-placeholder">IMG</span>
              </div>
              <div className="ur-product-details">
                <h3 className="ur-product-name">Pupuk Organik Cair Komotia 1L</h3>
                <p className="ur-product-variant">Varian: Standar</p>
                <p className="ur-order-date">Pesanan Selesai: 05 Apr 2026</p>
              </div>
            </div>
            <div className="ur-card-actions">
              <button className="ur-btn-primary">Beri Ulasan</button>
            </div>
          </div>
        </div>

        {/* CARD 2: Riwayat Ulasan (Contoh jika produk sudah diulas) */}
        <div className="ur-card">
          <div className="ur-card-content">
            <div className="ur-product-info">
              <div className="ur-product-image">
                <span className="ur-img-placeholder">IMG</span>
              </div>
              <div className="ur-product-details">
                <h3 className="ur-product-name">Benih Tomat Cherry Unggul</h3>
                <p className="ur-product-variant">Varian: 50 Biji</p>
                
                {/* Rating & Review Text */}
                <div className="ur-rating-section">
                  <div className="ur-stars">
                    ★★★★★
                  </div>
                  <span className="ur-review-date">Diulas pada 01 Apr 2026</span>
                </div>
                <p className="ur-review-text">
                  Kualitas benih sangat bagus, pengiriman cepat dan packaging aman. Mantap Komotia!
                </p>
              </div>
            </div>
            <div className="ur-card-actions ur-actions-column">
              <button className="ur-btn-secondary">Ubah Ulasan</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}