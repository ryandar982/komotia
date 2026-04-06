import React, { useState } from 'react';
import './Sellerdash.css';
import DashMain from './SellerDashMain';;
import ProductManager from './ProductManager';
import BuatDagangan from './BuatDagangan';
import RiwayatPesanan from './RiwayatPesanan';
import ProfileSeller from './PengaturanProfile';
import UlasanPembeli from './UlasanPembeli';
import { LayoutDashboard,UserRound,PackagePlus ,Package, Banknote} from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { History } from 'lucide-react';
import { ClipboardClock } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { CircleStar } from 'lucide-react';

export default function SellerMain() {
  const [isProdukOpen, setIsProdukOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const toggleProduk = () => {
    setIsProdukOpen(!isProdukOpen);
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const isProdukSectionActive = activeMenu === 'Produk Saya' || activeMenu === 'Buat Produk Baru';

  return (
    <div className='container-dashboard'>
      <div className='main-seller'>
        
        {/* SIDEBAR */}
        <div className='dashboard-side-bar'>
          <section>
            <img className='dashboard-img' src='asset/images/KINGMU.png' width='50' alt="Profile" />
            <div className='dashboard-info seller'>
              <h2>Nama Toko MU</h2>
              <button className='status-toko'>Toko Buka</button>
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
          </div>
        </div>

        {/* AREA KONTEN KANAN */}
        <div className='tess' style={{ flex: 1, padding: '40px' }}>
          {activeMenu === 'Dashboard' && <DashMain/> }
          {activeMenu === 'Profile Toko' && <ProfileSeller/>}
          {activeMenu === 'Pesanan' && <RiwayatPesanan/>}
          {activeMenu === 'Produk Saya' && <ProductManager/>}
          {activeMenu === 'Buat Produk Baru' && <BuatDagangan/>}
          {activeMenu === 'Ulasan' && <UlasanPembeli/>}
        </div>

      </div>
    </div>
  );
}