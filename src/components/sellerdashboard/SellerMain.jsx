import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate untuk redirect
import './Sellerdash.css';
import DashMain from './SellerDashMain';
import ProductManager from './ProductManager';
import BuatDagangan from './BuatDagangan';
import RiwayatPesanan from './RiwayatPesanan';
import ProfileSeller from './PengaturanProfile';
import UlasanPembeli from './UlasanPembeli';
import { 
  LayoutDashboard, 
  UserRound, 
  PackagePlus, 
  Package, 
  PackageOpen,
  ClipboardClock,
  CircleStar,
  LogOut // Import icon LogOut
} from 'lucide-react';

// Import dummy data yang sudah kita buat
import { sellerData } from '../../data/sellerData'; 
import { dummyProducts } from '../../data/dummyProducts';

export default function SellerMain() {
  const [isProdukOpen, setIsProdukOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  const navigate = useNavigate(); // Inisialisasi navigate

  // Ekstrak profil dari sellerData untuk digunakan di sidebar
  const { profile } = sellerData;

  const toggleProduk = () => {
    setIsProdukOpen(!isProdukOpen);
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  // Fungsi untuk menangani Logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari Seller Center?");
    if (confirmLogout) {
      // Di sini kamu bisa menambahkan logika untuk menghapus token/session jika ada
      // localStorage.removeItem('sellerToken');
      
      // Arahkan kembali ke halaman login
      navigate('/seller-login');
    }
  };

  const isProdukSectionActive = activeMenu === 'Produk Saya' || activeMenu === 'Buat Produk Baru';

  return (
    <div className='container-dashboard'>
      <div className='main-seller'>
        
        {/* SIDEBAR */}
        <div className='dashboard-side-bar'>
          <section>
            <img className='dashboard-img' src={profile.avatarUrl} width='50' alt="Profile Toko" />
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
          {activeMenu === 'Dashboard' && <DashMain profile={profile} /> }
          {activeMenu === 'Profile Toko' && <ProfileSeller profile={profile} />}
          {activeMenu === 'Pesanan' && <RiwayatPesanan orders={sellerData.orders} />}
          {activeMenu === 'Produk Saya' && <ProductManager products={dummyProducts} />}
          {activeMenu === 'Buat Produk Baru' && <BuatDagangan />}
          {activeMenu === 'Ulasan' && <UlasanPembeli reviews={sellerData.reviews} />}
        </div>

      </div>
    </div>
  );
}