import React from 'react';
import './UserWaitingPayment.css';

export default function UserWaitingPayment() {
  return (
    <div className="uwp-container">
      {/* HEADER SECTION */}
      <div className="uwp-header">
        <h2 className="uwp-title">Menunggu Pembayaran</h2>
      </div>

      {/* LIST PESANAN */}
      <div className="uwp-list">
        
        {/* CARD PESANAN 1 */}
        <div className="uwp-card">
          <div className="uwp-card-header">
            <span className="uwp-order-id">No. Tagihan: INV/20260407/001</span>
            <span className="uwp-status-badge">Belum Dibayar</span>
          </div>
          
          <div className="uwp-card-body">
            <div className="uwp-info">
              <p className="uwp-label">Total Pembayaran</p>
              <p className="uwp-price">Rp 250.000</p>
            </div>
            <div className="uwp-timer-section">
              <p className="uwp-label">Bayar Sebelum</p>
              <p className="uwp-timer">08 Apr 2026, 10:45 WIB</p>
            </div>
          </div>

          <div className="uwp-card-footer">
            <button className="uwp-btn-secondary">Batalkan Pesanan</button>
            <button className="uwp-btn-primary">Bayar Sekarang</button>
          </div>
        </div>

        {/* CARD PESANAN 2 */}
        <div className="uwp-card">
          <div className="uwp-card-header">
            <span className="uwp-order-id">No. Tagihan: INV/20260405/089</span>
            <span className="uwp-status-badge">Belum Dibayar</span>
          </div>
          
          <div className="uwp-card-body">
            <div className="uwp-info">
              <p className="uwp-label">Total Pembayaran</p>
              <p className="uwp-price">Rp 1.150.000</p>
            </div>
            <div className="uwp-timer-section">
              <p className="uwp-label">Bayar Sebelum</p>
              <p className="uwp-timer">07 Apr 2026, 23:59 WIB</p>
            </div>
          </div>

          <div className="uwp-card-footer">
            <button className="uwp-btn-secondary">Batalkan Pesanan</button>
            <button className="uwp-btn-primary">Bayar Sekarang</button>
          </div>
        </div>

      </div>

      {/* EMPTY STATE (Gunakan ini jika user tidak punya tagihan) */}
      {/* <div className="uwp-empty-state">
        <p className="uwp-empty-text">Tidak ada pesanan yang menunggu pembayaran saat ini.</p>
      </div> 
      */}
    </div>
  );
}