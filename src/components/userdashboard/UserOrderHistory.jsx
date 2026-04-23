import React from 'react';
import './UserOrderHistory.css';

export default function UserOrderHistory() {
  return (
    <div className="uoh-container">
      {/* HEADER SECTION */}
      <div className="uoh-header">
        <h2 className="uoh-title">Riwayat Pesanan</h2>
      </div>

      {/* FILTER & TAB SECTION */}
      <div className="uoh-top-card">
        {/* TABS */}
        <div className="uoh-tabs">
          <div className="uoh-tab">Menunggu Konfirmasi</div>
          <div className="uoh-tab">Pesanan Selesai</div>
          <div className="uoh-tab">Sedang Dibatalkan</div>
          <div className="uoh-tab">Pesanan Dibatalkan</div>
          <div className="uoh-tab">Semua Pesanan</div>
        </div>

        {/* CONTROLS (SEARCH & DROPDOWNS) */}
        <div className="uoh-controls">
          
          <select className="uoh-select uoh-select-medium">
            <option>Pilih Filter</option>
          </select>

          <select className="uoh-select uoh-select-medium">
            <option>Terlama</option>
          </select>
        </div>

        {/* TAGS / PILLS */}
        <div className="uoh-tags">
          <button className="uoh-tag active">Semua Pesanan</button>
        </div>
      </div>   

      {/* EMPTY STATE SECTION */}
      <div className="uoh-bottom-card">
        <div className="uoh-empty-state">
          {/* Kamu bisa ganti src gambar di bawah dengan aset aslimu */}
          <p className="uoh-empty-text">Kamu belum memiliki pesanan</p>
        </div>
      </div>
    </div>
  );
}