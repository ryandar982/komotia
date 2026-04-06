import React from 'react';
import './ProductManager.css';
import SellerProduct from './SellerProduct';

const ProductManager = () => {
  // Data sementara (dummy data) untuk keperluan tampilan antarmuka
  const dummyProducts = [
    { 
      id: 1, 
      name: 'Pupuk Organik Cap Bang Doel', 
      category: 'Pupuk Organik', 
      price: 71000, 
      stock: 3, 
      minOrder: 1, 
      updateDate: '29 Juni 2025', 
      updateTime: '21:22:05' 
    },
    { 
      id: 2, 
      name: 'Bibit Tomat ', 
      category: 'Bibit Tanaman', 
      price: 15000, 
      stock: 50, 
      minOrder: 5, 
      updateDate: '15 Maret 2026', 
      updateTime: '08:30:00' 
    },
    { 
      id: 3, 
      name: 'Pestisida Nabati', 
      category: 'Obat Pertanian', 
      price: 45000, 
      stock: 12, 
      minOrder: 2, 
      updateDate: '20 Maret 2026', 
      updateTime: '14:10:15' 
    }
  ];

  return (
    <div className="pm-container">
      {/* Action Row */}
      <div className="pm-action-row">
        <div className="pm-action-buttons">
          <button className="pm-btn pm-btn-primary">Tambah Produk</button>
        </div>
      </div>

      <div className="pm-list-container">
        {/* Table Header */}
        <div className="pm-list-header">
          <div>Dagangan</div>
          <div>Harga</div>
          <div>Stok</div>
          <div>Minimal</div>
          <div>Update</div>
          <div></div>
        </div>

        {/* Product List Container */}
        <div className="pm-product-list">
          {dummyProducts.map((product) => (
            <SellerProduct key={product.id} data={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;