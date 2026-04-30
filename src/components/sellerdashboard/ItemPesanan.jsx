import React from 'react';
import './ItemPesanan.css';

export default function ItemPesanan({ order }) {
  // Antisipasi jika data order tidak ada (belum ter-load)
  if (!order) return null;

  // Fungsi untuk memformat harga menjadi format Rupiah (contoh: 10000 -> 10.000)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  // Fungsi untuk memformat tanggal (contoh format ISO -> 24 Okt 2026, 14:30 WIB)
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

  return (
    <div className="ip-card">
      {/* BAGIAN ATAS: Info Pembeli & Status */}
      <div className="ip-header">
        <div className="ip-header-info">
          <span className="ip-buyer">👤 Pembeli: <strong>{order.buyerUsername}</strong></span>
          <span className="ip-dot">•</span>
          <span className="ip-date">{formatDate(order.createdAt)}</span>
          <span className="ip-dot">•</span>
          <span className="ip-invoice">{order.invoice}</span>
        </div>
        <div className="ip-status-badge">
          {order.status}
        </div>
      </div>

      {/* BAGIAN TENGAH: Detail Produk */}
      <div className="ip-body">
        <div className="ip-items-container">
          {/* Mapping items di dalam order */}
          {order.items.map((item, index) => (
            <div className="ip-product-details" key={index} style={{ marginBottom: order.items.length > 1 ? '15px' : '0' }}>
              <img 
                src={item.imageUrl || "https://via.placeholder.com/80"} 
                alt={item.productName} 
                className="ip-product-image" 
              />
              <div className="ip-product-text">
                <h4 className="ip-product-title">{item.productName}</h4>
                <p className="ip-product-variant">Kategori: {item.category}</p>
                <p className="ip-product-price">
                  Rp {formatRupiah(item.price)} <span className="ip-qty">x {item.quantity}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="ip-total-section">
          <p className="ip-total-label">Total Belanja</p>
          <p className="ip-total-value">Rp {formatRupiah(order.totalAmount)}</p>
        </div>
      </div>

      {/* BAGIAN BAWAH: Tombol Aksi */}
      <div className="ip-footer">
        <button className="ip-btn ip-btn-outline">Hubungi Pembeli</button>
        {/* Tombol aksi bisa disesuaikan dengan status pesanan (misal: kalau status selesai, tombol proses dihilangkan) */}
        {order.status === 'Perlu Diproses' && (
          <button className="ip-btn ip-btn-primary">Proses Pesanan</button>
        )}
      </div>
    </div>
  );
}