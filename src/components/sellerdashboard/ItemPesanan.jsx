import React, { useState } from 'react';
import './ItemPesanan.css';
import { supabase } from '../../config/supabaseClient';

export default function ItemPesanan({ order }) {
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleProsesPesanan = async () => {
    if (window.confirm('Apakah Anda yakin ingin memproses pesanan ini?')) {
      try {
        setIsProcessing(true);
        
        // 1. Update status di tabel orders (untuk Seller Dashboard)
        const { error: orderError } = await supabase
          .from('orders')
          .update({ status: 'Pesanan Selesai' })
          .eq('id_order', order.id);

        if (orderError) throw orderError;

        // 2. Ambil data order lengkap untuk mendapatkan id_user dan id_seller
        const { data: orderData, error: fetchError } = await supabase
          .from('orders')
          .select('id_user, id_seller, total_amount, created_at')
          .eq('id_order', order.id)
          .single();

        if (!fetchError && orderData) {
          // 3. Update status di tabel transactions (untuk User Dashboard)
          // Cocokkan berdasarkan id_user, id_seller, dan total_harga
          const { error: trxError } = await supabase
            .from('transactions')
            .update({ status: 'Pesanan Selesai' })
            .eq('id_user', orderData.id_user)
            .eq('id_seller', orderData.id_seller)
            .eq('total_harga', orderData.total_amount);

          if (trxError) {
            console.warn('Gagal update tabel transactions:', trxError.message);
          }
        }
        
        alert('Pesanan berhasil diproses!');
        window.location.reload();
      } catch (error) {
        console.error('Error processing order:', error);
        alert('Gagal memproses pesanan: ' + error.message);
      } finally {
        setIsProcessing(false);
      }
    }
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
        {/* Tombol aksi bisa disesuaikan dengan status pesanan */}
        {order.status === 'Perlu Diproses' && (
          <button 
            className="ip-btn ip-btn-primary" 
            onClick={handleProsesPesanan}
            disabled={isProcessing}
          >
            {isProcessing ? 'Memproses...' : 'Proses Pesanan'}
          </button>
        )}
      </div>
    </div>
  );
}