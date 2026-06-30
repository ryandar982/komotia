import React, { useState, useEffect } from 'react';
import './UserWaitingPayment.css';

export default function UserWaitingPayment({ data }) {
  const [payments, setPayments] = useState(data || []);

  useEffect(() => {
    setPayments(data || []);
  }, [data]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleCancel = (id) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin membatalkan pesanan dengan No. Tagihan: TRX-${id}?`);
    
    if (isConfirmed) {
      // IDEALLY: Update status to 'dibatalkan' in Supabase here.
      const updatedPayments = payments.filter((item) => item.id !== id);
      setPayments(updatedPayments);
      alert('Pesanan berhasil dibatalkan.');
    }
  };

  return (
    <div className="uwp-container">
      <div className="uwp-header">
        <h2 className="uwp-title">Menunggu Pembayaran</h2>
      </div>

      <div className="uwp-list">
        {payments && payments.length > 0 ? (
          payments.map((item) => (
            <div className="uwp-card" key={item.id}>
              <div className="uwp-card-header">
                <span className="uwp-order-id">No. Tagihan: TRX-{item.id}</span>
                <span className="uwp-status-badge">{item.status}</span>
              </div>
              
              <div className="uwp-card-body">
                <div className="uwp-info">
                  <p className="uwp-label">Total Pembayaran</p>
                  <p className="uwp-price">{formatRupiah(item.totalAmount)}</p>
                </div>
                <div className="uwp-timer-section">
                  <p className="uwp-label">Tanggal Pesanan</p>
                  <p className="uwp-timer">{new Date(item.date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="uwp-card-footer">
                <button 
                  className="uwp-btn-secondary"
                  onClick={() => handleCancel(item.id)}
                >
                  Batalkan Pesanan
                </button>
                <button className="uwp-btn-primary">Bayar Sekarang</button>
              </div>
            </div>
          ))
        ) : (
          <div className="uwp-empty-state">
            <p className="uwp-empty-text">Tidak ada pesanan yang menunggu pembayaran saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}