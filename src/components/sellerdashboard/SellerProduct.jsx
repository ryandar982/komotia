import React from 'react';
import './ProductManager.css';

const SellerProduct = ({ data }) => {
  return (
    <div className="pm-product-item">
      <div className="pm-product-details">
        <div className="pm-col-dagangan">
          <a href="#link" className="product-title">{data.name}</a>
          <div className="product-subtitle">{data.category}</div>
          <div className="delivery-badge"></div>
        </div>
        
        <div className="pm-col-harga">
          <span className="price-highlight">
            Rp {data.price.toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="pm-col-stok">{data.stock} Barang</div>
        <div className="pm-col-minimal">{data.minOrder} Barang</div>
        
        <div className="pm-col-update">
          <div>{data.updateDate}</div>
          <div>{data.updateTime}</div>
        </div>
        
        <div className="pm-col-action">
          <select className="pm-select pm-action-select">
            <option>Edit</option>
            <option>Edit Stok</option>
            <option>Hapus</option>
          </select>
        </div>
      </div>
      
      {/* Item Bottom Bar */}
      <div className="pm-product-bottom-bar">
      </div>
    </div>
  );
};

export default SellerProduct;