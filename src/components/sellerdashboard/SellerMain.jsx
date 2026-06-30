import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sellerdash.css';
import DashMain from './SellerDashMain';
import ProductManager from './ProductManager';
import BuatDagangan from './BuatDagangan';
import RiwayatPesanan from './RiwayatPesanan';
import ProfileSeller from './PengaturanProfile';
import UlasanPembeli from './UlasanPembeli';
import KelolaKolektif from './KelolaKolektif';
import { 
  LayoutDashboard, 
  UserRound, 
  PackagePlus, 
  Package, 
  PackageOpen,
  ClipboardClock,
  CircleStar,
  Users,
  LogOut 
} from 'lucide-react';

import { useSellerData } from '../../hooks/useSellerData';
import { useSellerOrders } from '../../hooks/useSellerOrders';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useSellerReviews } from '../../hooks/useSellerReviews';

export default function SellerMain() {
  const [isProdukOpen, setIsProdukOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('sellerId');

  // Fetch data
  const { seller, loading: sellerLoading } = useSellerData(sellerId);
  const { orders, loading: ordersLoading } = useSellerOrders(sellerId);
  const { products, loading: productsLoading, refetchProducts } = useSellerProducts(sellerId);
  const { reviews, loading: reviewsLoading } = useSellerReviews(sellerId);

  useEffect(() => {
    if (!sellerId) {
      navigate('/seller-login');
    }
  }, [sellerId, navigate]);

  const toggleProduk = () => {
    setIsProdukOpen(!isProdukOpen);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (menu !== 'Buat Produk Baru') {
      setEditingProduct(null);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari Seller Center?");
    if (confirmLogout) {
      localStorage.removeItem('sellerId');
      navigate('/seller-login');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setActiveMenu('Buat Produk Baru');
    if (!isProdukOpen) setIsProdukOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      alert("ID Produk tidak ditemukan.");
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus produk dengan ID: ' + productId + '?')) {
      const { data, error, count } = await supabase
        .from('products')
        .delete()
        .eq('id_product', productId)
        .select();

      if (error) {
        alert('Gagal menghapus produk: ' + error.message);
      } else if (!data || data.length === 0) {
        alert(`Gagal menghapus produk (ID: ${productId}). Kemungkinan terhalang kebijakan akses database (RLS Policy) atau produk tidak ditemukan. Pastikan tabel products mengizinkan DELETE.`);
      } else {
        alert(`Berhasil menghapus produk!`);
        refetchProducts();
      }
    }
  };

  const isProdukSectionActive = activeMenu === 'Produk Saya' || activeMenu === 'Buat Produk Baru';

  if (sellerLoading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat data seller...</div>;
  }

  if (!seller) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Gagal memuat profil seller.</div>;
  }

  // Format profil untuk menyesuaikan komponen anak
  const profile = {
    storeName: seller.nama_toko,
    ownerName: seller.nama_pemilik,
    email: seller.email,
    address: seller.alamat,
    avatarUrl: seller.avatar_url,
    isOpen: seller.is_open,
    // Kita juga bisa pass raw seller info kalau dibutuhkan
    ...seller
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  return (
    <div className='container-dashboard'>
      <div className='main-seller'>
        
        {/* SIDEBAR */}
        <div className='dashboard-side-bar'>
          <section>
            {profile.avatarUrl ? (
              <img className='dashboard-img' src={profile.avatarUrl} width='50' alt="Profile Toko" />
            ) : (
              <div 
                className='dashboard-img' 
                style={{
                  backgroundColor: '#4CAF50', 
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                {getInitials(profile.storeName)}
              </div>
            )}
            <div className='dashboard-info seller'>
              <h2>{profile.storeName}</h2>
              <button className='status-toko'>
                {profile.isOpen ? 'Toko Buka' : 'Toko Tutup'}
              </button>
            </div>
          </section>
          
          <div className='opsi-seller-container'>
            <div 
              className={`opsi-seller ${activeMenu === 'Dashboard' ? 'active' : ''}`} 
              onClick={() => handleMenuClick('Dashboard')}
            >
              <LayoutDashboard/> Dashboard
            </div>
            
            <div 
              className={`opsi-seller ${activeMenu === 'Profile Toko' ? 'active' : ''}`} 
              onClick={() => handleMenuClick('Profile Toko')}
            >
              <UserRound/>Profile Toko
            </div>
            
            <div 
              className={`opsi-seller ${activeMenu === 'Pesanan' ? 'active' : ''}`} 
              onClick={() => handleMenuClick('Pesanan')}
            >
              <ClipboardClock/>Pesanan
            </div>
            
            {/* MENU PRODUK (PARENT) */}
            <div 
              className={`opsi-seller ${isProdukSectionActive ? 'active' : ''}`} 
              onClick={toggleProduk} 
            >
              <Package/>Produk
              <span className={`arrow-icon ${isProdukOpen ? 'open' : ''}`}></span> 
            </div>

            {/* SUB-MENU PRODUK */}
            <div className={`sub-menu-produk ${isProdukOpen ? 'open' : ''}`}>
              <div className='inner-sub-menu'>
                <div 
                  className={`opsi-seller sub-opsi ${activeMenu === 'Produk Saya' ? 'active' : ''}`} 
                  onClick={() => handleMenuClick('Produk Saya')}
                >
                  <PackageOpen/>Produk Saya
                </div>
                <div 
                  className={`opsi-seller sub-opsi ${activeMenu === 'Buat Produk Baru' ? 'active' : ''}`} 
                  onClick={() => handleMenuClick('Buat Produk Baru')}
                >
                  <PackagePlus/> Buat Produk Baru
                </div>
              </div>
            </div>

            <div 
              className={`opsi-seller ${activeMenu === 'Ulasan' ? 'active' : ''}`} 
              onClick={() => handleMenuClick('Ulasan')}
            >
              <CircleStar/>Ulasan
            </div>

            <div 
              className={`opsi-seller ${activeMenu === 'Kolektif' ? 'active' : ''}`} 
              onClick={() => handleMenuClick('Kolektif')}
            >
              <Users/>Kolektif
            </div>

            {/* TOMBOL LOGOUT */}
            <div 
              className="opsi-seller btn-logout" 
              onClick={handleLogout}
              style={{ marginTop: 'auto' }}
            >
              <LogOut/> Keluar
            </div>
            
          </div>
        </div>

        {/* AREA KONTEN KANAN */}
        <div className='tess' style={{ flex: 1, padding: '40px' }}>
          {activeMenu === 'Dashboard' && <DashMain seller={seller} /> }
          {activeMenu === 'Profile Toko' && <ProfileSeller profile={profile} />}
          {activeMenu === 'Pesanan' && (
            ordersLoading ? <p>Memuat pesanan...</p> : <RiwayatPesanan orders={orders} />
          )}
          {activeMenu === 'Produk Saya' && (
            productsLoading ? <p>Memuat produk...</p> : <ProductManager products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
          )}
          {activeMenu === 'Buat Produk Baru' && (
            <BuatDagangan 
              sellerId={sellerId} 
              initialData={editingProduct} 
              onComplete={() => {
                setEditingProduct(null);
                refetchProducts();
                handleMenuClick('Produk Saya');
              }} 
            />
          )}
          {activeMenu === 'Ulasan' && (
            reviewsLoading ? <p>Memuat ulasan...</p> : <UlasanPembeli reviews={reviews} />
          )}
          {activeMenu === 'Kolektif' && (
            <KelolaKolektif sellerId={sellerId} />
          )}
        </div>

      </div>
    </div>
  );
}