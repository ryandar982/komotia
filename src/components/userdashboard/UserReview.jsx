import React, { useState } from 'react';
import './UserReview.css';

export default function UserReview({ data }) {
  const [activeTab, setActiveTab] = useState('menunggu');

  const waitingList = data?.waitingForReview || [];
  const historyList = data?.reviewHistory || [];

  return (
    <div className="ur-container">
      <div className="ur-header">
        <h2 className="ur-title">Ulasan Saya</h2>
      </div>

      <div className="ur-tabs-container">
        <div className="ur-tabs">
          <div 
            className={`ur-tab ${activeTab === 'menunggu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menunggu')}
            style={{ cursor: 'pointer' }}
          >
            Menunggu Diulas
          </div>
          <div 
            className={`ur-tab ${activeTab === 'riwayat' ? 'active' : ''}`}
            onClick={() => setActiveTab('riwayat')}
            style={{ cursor: 'pointer' }}
          >
            Riwayat Ulasan
          </div>
        </div>
      </div>

      <div className="ur-list">
        
        {activeTab === 'menunggu' && (
          waitingList.length > 0 ? (
            waitingList.map((item, index) => (
              <div className="ur-card" key={item.productId || index}>
                <div className="ur-card-content">
                  <div className="ur-product-info">
                    <div className="ur-product-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="ur-img-placeholder">IMG</span>
                      )}
                    </div>
                    <div className="ur-product-details">
                      <h3 className="ur-product-name">{item.productName}</h3>
                      <p className="ur-product-variant">Varian: {item.variant}</p>
                      <p className="ur-order-date">Pesanan Selesai: {item.orderCompletedDate}</p>
                    </div>
                  </div>
                  <div className="ur-card-actions">
                    <button className="ur-btn-primary">Beri Ulasan</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              Tidak ada produk yang menunggu untuk diulas.
            </div>
          )
        )}

        {activeTab === 'riwayat' && (
          historyList.length > 0 ? (
            historyList.map((item, index) => (
              <div className="ur-card" key={item.reviewId || index}>
                <div className="ur-card-content">
                  <div className="ur-product-info">
                    <div className="ur-product-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="ur-img-placeholder">IMG</span>
                      )}
                    </div>
                    <div className="ur-product-details">
                      <h3 className="ur-product-name">{item.productName}</h3>
                      <p className="ur-product-variant">Varian: {item.variant}</p>
                      
                      <div className="ur-rating-section">
                        <div className="ur-stars">
                          {"★".repeat(item.rating)}
                        </div>
                        <span className="ur-review-date">Diulas pada {item.reviewDate}</span>
                      </div>
                      <p className="ur-review-text">
                        {item.reviewText}
                      </p>
                    </div>
                  </div>
                  <div className="ur-card-actions ur-actions-column">
                    <button className="ur-btn-secondary">Ubah Ulasan</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              Anda belum memiliki riwayat ulasan.
            </div>
          )
        )}

      </div>
    </div>
  );
}