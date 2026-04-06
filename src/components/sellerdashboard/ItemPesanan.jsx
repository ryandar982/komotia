import React from 'react';
import './ItemPesanan.css';

export default function ItemPesanan() {
  return (
    <div className="ip-card">
      {/* BAGIAN ATAS: Info Pembeli & Status */}
      <div className="ip-header">
        <div className="ip-header-info">
          <span className="ip-buyer">👤 Pembeli: <strong>Ryandar123</strong></span>
          <span className="ip-dot">•</span>
          <span className="ip-date">24 Okt 2026, 14:30 WIB</span>
          <span className="ip-dot">•</span>
          <span className="ip-invoice">INV/20261024/XYZ/98765</span>
        </div>
        <div className="ip-status-badge">
          Perlu Diproses
        </div>
      </div>

      {/* BAGIAN TENGAH: Detail Produk */}
      <div className="ip-body">
        <div className="ip-product-details">
          {/* Ganti src dengan gambar produk aslinya nanti */}
          <img 
            src="https://via.placeholder.com/80" 
            alt="Produk" 
            className="ip-product-image" 
          />
          <div className="ip-product-text">
            <h4 className="ip-product-title">Bibit Tomat</h4>
            <p className="ip-product-variant">Kategori: Bibit</p>
            <p className="ip-product-price">Rp 5.000 <span className="ip-qty">x 2</span></p>
          </div>
        </div>
        
        <div className="ip-total-section">
          <p className="ip-total-label">Total Belanja</p>
          <p className="ip-total-value">Rp 10.000</p>
        </div>
      </div>

      {/* BAGIAN BAWAH: Tombol Aksi */}
      <div className="ip-footer">
        <button className="ip-btn ip-btn-outline">Hubungi Pembeli</button>
        <button className="ip-btn ip-btn-primary">Proses Pesanan</button>
      </div>
    </div>
  );
}