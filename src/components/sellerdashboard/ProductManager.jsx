import React from 'react';
import './ProductManager.css';
import SellerProduct from './SellerProduct';

const ProductManager = ({ products = [], onEdit, onDelete }) => {
  // Karena struktur dummyProducts sebelumnya belum memiliki data stok dan waktu update,
  // kita tambahkan nilai default (fallback) sementara agar komponen SellerProduct tetap berjalan normal.
  const enrichedProducts = products.map((product) => ({
    ...product,
    stock: product.stok || product.stock || Math.floor(Math.random() * 50) + 5,
    minOrder: product.minOrder || 1,
    updateDate: product.created_at 
      ? new Date(product.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      : (product.updateDate || '-'),
    updateTime: product.created_at
      ? new Date(product.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : (product.updateTime || '-')
  }));

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
          {enrichedProducts.length > 0 ? (
            enrichedProducts.map((product) => (
              <SellerProduct 
                key={product.id_product || product.id} 
                data={product} 
                onEdit={() => onEdit && onEdit(product)}
                onDelete={() => onDelete && onDelete(product.id_product || product.id)}
              />
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Belum ada produk yang ditambahkan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;