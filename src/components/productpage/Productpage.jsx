import './Productpage.css';
import React, { useState } from 'react'; // Tambahkan baris ini

export default function Productpage(){
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };
    return(
      <div className="product-container">
      {/* Top Section: Image Gallery & Product Details */}
      <div className="product-main">
        
        {/* Left Column: Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-placeholder">
            <span className="image-text">Gambar Utama</span>
          </div>
          <div className="thumbnails">
            <div className="thumbnail active">1</div>
            <div className="thumbnail">2</div>
            <div className="thumbnail">3</div>
            <div className="thumbnail play-btn">▶</div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="product-details">
          <h1 className="product-title">Bibit Organik Premium | Esco Shop</h1>
          
          <div className="product-stats">
            <span className="stars">★</span>
            <span className="rating-score">4.8</span>
            <span className="reviews">32 reviews</span>
            <span className="dot">•</span>
            <span className="sold">3 sold</span>
          </div>

          <div className="product-price">
            <span className="current-price">Rp 320.000</span>
            <span className="original-price">Rp 500.000</span>
            <span className="discount">11% off</span>
          </div>

          <div className="promo-banner">
            <span className="promo-icon">🏷️</span>
            <div>
              <strong>Limited Time</strong>
              <p>Dapatkan Promo Hingga 20% dengan Kode Promo : '2392'</p>
            </div>
          </div>

          <div className="delivery-info">
            <div className="info-row">
              <span className="icon">🚚</span>
              <div>
                <strong>Gratis Ongkir</strong>
                <p>Untuk Seluruh Indonesia</p>
              </div>
            </div>  
          </div>

          <div className="quantity-section">
            <span className="qty-label">Jumlah:</span>
            <div className="qty-controls">
              <button onClick={handleDecrease}>−</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={handleIncrease}>+</button>
            </div>
            <span className="stock-info">Tersedia (47 Tersisa)</span>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary">Beli Sekarang</button>
            <button className="btn btn-secondary">Tambahkan Ke Keranjang</button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Seller Info */}
      <div className="seller-info">
        <div className="seller-profile">
          <div className="seller-avatar">
            <img src='asset/images/free-dev.png' height='35'/>
          </div>
          <div className="seller-details">
            <h3>EscoShop</h3>
            <div className="seller-stats">
              <span className="stars">★</span>
              <span>4.5 (840 reviews)</span>
            </div>
            <p>96% response rate</p>
          </div>
        </div>
        <button className="btn btn-primary btn-chat">Chat Seller</button>
      </div>
    </div>
    );
}