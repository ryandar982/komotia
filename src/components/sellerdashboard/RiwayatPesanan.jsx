import React from 'react';
import './RiwayatPesanan.css';
import Pesanan from './ItemPesanan';

export default function RiwayatPesanan() {
  return (
    <div className="rp-container">
      {/* HEADER SECTION */}
      <div className="rp-header">
        <h2 className="rp-title">Riwayat Pesanan</h2>
      </div>

      {/* FILTER & TAB SECTION */}
      <div className="rp-top-card">
        {/* TABS */}
        <div className="rp-tabs">
          <div className="rp-tab active">Perlu Diproses</div>
          <div className="rp-tab">Menunggu Konfirmasi</div>
          <div className="rp-tab">Pesanan Selesai</div>
          <div className="rp-tab">Sedang Dibatalkan</div>
          <div className="rp-tab">Pesanan Dibatalkan</div>
          <div className="rp-tab">Semua Pesanan</div>
        </div>

        {/* CONTROLS (SEARCH & DROPDOWNS) */}
        <div className="rp-controls">
          
          <select className="rp-select rp-select-medium">
            <option>Pilih Filter</option>
          </select>

          <select className="rp-select rp-select-medium">
            <option>Terlama</option>
          </select>
        </div>

        {/* TAGS / PILLS */}
        <div className="rp-tags">
          <button className="rp-tag active">Semua Pesanan</button>
        </div>
      </div>
      
      <Pesanan/>    

      {/* EMPTY STATE SECTION */}
      <div className="rp-bottom-card">
        <div className="rp-empty-state">
          {/* Kamu bisa ganti src gambar di bawah dengan aset aslimu */}
          <p className="rp-empty-text">Kamu belum memiliki pesanan</p>
        </div>
      </div>
    </div>
  );
}