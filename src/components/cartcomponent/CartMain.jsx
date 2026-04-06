import React from 'react';
import './CartMain.css';
import { 
  MapPin, 
  Store, 
  Trash2, 
  Heart, 
  Minus, 
  Plus, 
  Truck 
} from 'lucide-react';

export default function CartMain() {
  // Simulasi data keranjang belanja
  const cartItems = [
    {
      id: 1,
      toko: "Komotia Fresh",
      nama: "Bibit Jagung | 1 Karung ",
      gambar: "asset/images/bibit-jagung-stock.jpeg",
      harga: 12500,
      hargaCoret: 18000,
      diskon: "30%",
      stok: 45,
      qty: 2,
      pengiriman: "JNE Reguler"
    },
    {
      id: 2,
      toko: "Tani Makmur Jaya",
      nama: "Pupuk Organik | 1 Karung",
      gambar: "asset/images/pupuk-organik-stock.jpeg",
      harga: 45000,
      hargaCoret: 0,
      diskon: null,
      stok: 120,
      qty: 1,
      pengiriman: "JNT One Day"
    }
  ];

  return (
    <div className='cart-container'>
      <h2 className='cart-page-title'>Troli Belanja</h2>

      <div className='cart-layout'>
        {/* BAGIAN KIRI - DAFTAR PRODUK */}
        <div className='cart-main-content'>
          
          {/* Section Alamat Pengiriman (Baru) */}
          <div className='cart-section address-section'>
            <div className='address-header'>
              <MapPin size={20} className='icon-orange' />
              <strong>Alamat Pengiriman</strong>
            </div>
            <div className='address-body'>
              <p><strong>Ryandar Anugrah Fajar</strong> (+62) 812-3456-7890</p>
              <p>Jl. Ketintang Baru No. 123, Gayungan, Kota Surabaya, Jawa Timur 60231</p>
            </div>
            <button className='btn-ubah-alamat'>Ubah Alamat</button>
          </div>

          {/* Section Pilih Semua */}
          <div className='cart-section select-all-bar'>
            <div className='checkbox-group'>
              <input type='checkbox' id='selectAll' defaultChecked />
              <label htmlFor='selectAll'>Pilih Semua Produk</label>
            </div>
            <button className='btn-hapus-text'>Hapus Dari Keranjang</button>
          </div>

          {/* List Produk */}
          {cartItems.map((item) => (
            <div key={item.id} className='cart-section cart-item-card'>
              
              {/* Header Toko */}
              <div className='item-store-header'>
                <input type='checkbox' defaultChecked />
                <Store size={18} />
                <strong>{item.toko}</strong>
              </div>

              {/* Detail Produk */}
              <div className='item-product-detail'>
                <input type='checkbox' className='item-checkbox' defaultChecked />
                <img src={item.gambar} alt={item.nama} className='item-image' />
                
                <div className='item-info'>
                  <h3>{item.nama}</h3>
                  
                  <div className='item-price-row'>
                    <span className='price-final'>Rp{item.harga.toLocaleString('id-ID')}</span>
                    {item.diskon && (
                      <>
                        <span className='price-discount-badge'>{item.diskon}</span>
                        <span className='price-original'>Rp{item.hargaCoret.toLocaleString('id-ID')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className='item-shipping-info'>
                  <div className='shipping-badge'>
                    <Truck size={14} />
                    {item.pengiriman}
                  </div>
                </div>
              </div>

              {/* Informasi Pesanan & Aksi */}
              <div className='item-order-info'>
                <strong>Informasi Pesanan</strong>
                
                <div className='item-action-row'>
                  <div className='note-input-container'>
                    <input 
                      type='text' 
                      placeholder='Catatan untuk Penjual (Optional)' 
                      className='note-input'
                    />
                  </div>

                  <div className='action-controls'>
                    <span className='stock-label'>Stok {item.stok}</span>
                    <button className='icon-btn'><Heart size={20} /></button>
                    <button className='icon-btn'><Trash2 size={20} /></button>
                    
                    <div className='qty-control'>
                      <button className='qty-btn'><Minus size={16} /></button>
                      <input type='text' value={item.qty} readOnly className='qty-input' />
                      <button className='qty-btn'><Plus size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* BAGIAN KANAN - RINGKASAN BELANJA (Sticky) */}
        <div className='cart-sidebar'>
          <div className='summary-card'>
            <h3>Ringkasan Belanja</h3>
            
            <div className='summary-row'>
              <span>Total Harga (3 Produk)</span>
              <span>Rp70.000</span>
            </div>
            <div className='summary-row'>
              <span>Total Diskon Barang</span>
              <span>-Rp11.000</span>
            </div>
            
            <hr className='summary-divider' />
            
            <div className='summary-row total'>
              <span>Total Pembelian</span>
              <span className='total-price'>Rp59.000</span>
            </div>
            
            <button className='btn-beli'>Beli (3)</button>
          </div>
        </div>

      </div>
    </div>
  );
}