import React from 'react';
import './UlasanPembeli.css';

export default function UlasanPembeli() {
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
              <strong>5.0</strong> / 5.0
            </div>
            
            {/* Breakdown Bintang */}
            <div className="up-rating-breakdown">
              <div className="up-rating-row">
                <span className="up-stars">★★★★★</span>
                <span className="up-count">109</span>
              </div>
              <div className="up-rating-row">
                <span className="up-stars">★★★★<span className="up-star-empty">★</span></span>
                <span className="up-count">0</span>
              </div>
              <div className="up-rating-row">
                <span className="up-stars">★★★<span className="up-star-empty">★★</span></span>
                <span className="up-count">2</span>
              </div>
              <div className="up-rating-row">
                <span className="up-stars">★★<span className="up-star-empty">★★★</span></span>
                <span className="up-count">0</span>
              </div>
              <div className="up-rating-row">
                <span className="up-stars">★<span className="up-star-empty">★★★★</span></span>
                <span className="up-count">0</span>
              </div>
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

            <div className="up-filter-pills">
              <button className="up-pill active">Semua</button>
              <button className="up-pill"><span className="up-star-icon">★</span> 5</button>
              <button className="up-pill"><span className="up-star-icon">★</span> 4</button>
              <button className="up-pill"><span className="up-star-icon">★</span> 3</button>
              <button className="up-pill"><span className="up-star-icon">★</span> 2</button>
              <button className="up-pill"><span className="up-star-icon">★</span> 1</button>
            </div>
          </div>

          {/* List Ulasan */}
          <div className="up-reviews-list">
            
            {/* Contoh Ulasan 1 */}
            <div className="up-review-item">
              <div className="up-review-avatar">
                {/* Pakai placeholder gambar profil */}
                <img src="https://via.placeholder.com/40" alt="Avatar" />
              </div>
              <div className="up-review-content">
                <div className="up-review-header">
                  <span className="up-reviewer-name">Ryandar Anugrah </span>
                  <span className="up-review-date">30 Mar 2026, 10:30 WIB</span>
                </div>
                <div className="up-review-stars">
                  <span className="up-stars-text">★★★★★</span>
                </div>
                <div className="up-review-product">
                  Varian: <strong>Pupuk Organik</strong>
                </div>
                <p className="up-review-text">
                  Recommended seller!
                </p>
              </div>
            </div>

            {/* Contoh Ulasan 2 */}
            <div className="up-review-item">
              <div className="up-review-avatar">
                <img src="https://via.placeholder.com/40" alt="Avatar" />
              </div>
              <div className="up-review-content">
                <div className="up-review-header">
                  <span className="up-reviewer-name">Irzaq Akmal Alhaqqy</span>
                  <span className="up-review-date">28 Mar 2026, 15:45 WIB</span>
                </div>
                <div className="up-review-stars">
                  <span className="up-stars-text">★★★★★</span>
                </div>
                <div className="up-review-product">
                  Varian: <strong>Pestisida Alami</strong>
                </div>
                <p className="up-review-text">
                  Bakal langganan beli di sini terus. Makasih ya!
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}