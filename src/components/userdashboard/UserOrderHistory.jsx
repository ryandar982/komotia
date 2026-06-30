import React from 'react';
import './UserOrderHistory.css';

export default function UserOrderHistory({ data }) {
  const [filter, setFilter] = React.useState('Semua Pesanan');

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const filteredData = (data || []).filter(order => {
    if (filter === 'Semua Pesanan') return true;
    if (filter === 'Pesanan Selesai' && order.status === 'selesai') return true;
    if (filter === 'Pesanan Dibatalkan' && order.status === 'dibatalkan') return true;
    if (filter === 'Menunggu Konfirmasi' && order.status === 'pending') return true;
    return false;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'selesai': return { label: 'SELESAI', className: 'status-success' };
      case 'pending': return { label: 'PENDING', className: 'status-warning' };
      case 'dibatalkan': return { label: 'DIBATALKAN', className: 'status-danger' };
      default: return { label: status.toUpperCase(), className: 'status-default' };
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
          {['Semua Pesanan', 'Menunggu Konfirmasi', 'Pesanan Selesai', 'Pesanan Dibatalkan'].map(tab => (
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
                  {order.items.map(item => (
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
                    </div>
                  ))}
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
    </div>
  );
}