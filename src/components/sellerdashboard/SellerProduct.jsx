import React from 'react';
import './ProductManager.css';

const SellerProduct = ({ data, onEdit, onDelete }) => {
  // Pemetaan kolom sesuai tabel Supabase baru
  const namaProduk = data.nama_product || data.name || "Produk Tanpa Nama";
  const kategori = data.category || "-";
  const harga = data.harga || data.price || 0;
  const stok = data.stok || data.stock || 0;
  const satuan = data.satuan || "Barang";
  const minOrder = data.minOrder || 1;
  const updateDate = data.created_at 
    ? new Date(data.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    : (data.updateDate || '-');
  const updateTime = data.created_at
    ? new Date(data.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : (data.updateTime || '-');

  return (
    <div className="pm-product-item">
      <div className="pm-product-details">
        <div className="pm-col-dagangan">
          <a href="#link" className="product-title">{namaProduk}</a>
          <div className="product-subtitle">{kategori}</div>
          <div className="delivery-badge"></div>
        </div>
        
        <div className="pm-col-harga">
          <span className="price-highlight">
            Rp {Number(harga).toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="pm-col-stok">{stok} {satuan}</div>
        <div className="pm-col-minimal">{minOrder} {satuan}</div>
        
        <div className="pm-col-update">
          <div>{updateDate}</div>
          <div>{updateTime}</div>
        </div>
        
        <div className="pm-col-action" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
          <button 
            className="pm-btn pm-btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '13px' }}
            onClick={() => onEdit && onEdit()}
          >
            Edit
          </button>
          <button 
            className="pm-btn pm-btn-danger" 
            style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: '#dc3545', color: '#fff', border: 'none' }}
            onClick={() => onDelete && onDelete()}
          >
            Hapus
          </button>
        </div>
      </div>
      
      {/* Item Bottom Bar */}
      <div className="pm-product-bottom-bar">
      </div>
    </div>
  );
};

export default SellerProduct;