import React, { useState } from 'react';
import './UserMain.css';
import UserProfile from './UserProfile';
import UserDashMain from './UserDashMain';
import { LayoutDashboard,UserRound } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { History } from 'lucide-react';
import { ClipboardClock } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { CircleStar } from 'lucide-react';
import CartComp from '../cartcomponent/CartMain';

export default function UserMain() {
  // 1. STATE BEDA: Menggunakan penamaan khusus User
  const [isPesananOpen, setIsPesananOpen] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState('Dashboard');

  // 2. FUNGSI BEDA: Disetel untuk menu pesanan
  const togglePesanan = () => {
    setIsPesananOpen(!isPesananOpen);
  };

  const handleUserMenuClick = (menuName) => {
    setActiveUserMenu(menuName);
  };

  // 3. LOGIKA DROPDOWN BEDA
  const isPesananSectionActive = activeUserMenu === 'Menunggu Pembayaran' || activeUserMenu === 'Riwayat Transaksi';

  return (
    <div className='container-dashboard'>
      {/* 4. CLASS BEDA: main-seller diubah jadi main-user */}
      <div className='main-user'>
        
        {/* SIDEBAR */}
        <div className='dashboard-side-bar'>
          <section>
            <img className='dashboard-img' src='asset/images/KINGNANA.jpeg' width='50' alt="Profile User" />
            <div className='dashboard-info user'> {/* class seller diubah jadi user */}
              <h2>Nama Pembeli</h2>
              <button className='status-user'>Member Silver</button> {/* status toko diubah jadi status user */}
            </div>
          </section>
          
          <div className='opsi-user-container'> {/* opsi-seller-container diubah */}
            <div 
              className={`opsi-user ${activeUserMenu === 'Dashboard' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Dashboard')}
            >
              <LayoutDashboard />  Dashboard
            </div>
            
            <div 
              className={`opsi-user ${activeUserMenu === 'Profile Saya' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Profile Saya')}
            >
              <UserRound /> Profile Saya
            </div>
            
            {/* MENU PESANAN (PARENT DROPDOWN) */}
            <div 
              className={`opsi-user ${isPesananSectionActive ? 'active' : ''}`} 
              onClick={togglePesanan} 
            >
              <PackageOpen/>Pesanan Saya
              <span className={`arrow-icon ${isPesananOpen ? 'open' : ''}`}></span> 
            </div>

            {/* SUB-MENU PESANAN */}
            <div className={`sub-menu-user ${isPesananOpen ? 'open' : ''}`}>
              <div className='inner-sub-menu'>
                <div 
                  className={`opsi-user sub-opsi ${activeUserMenu === 'Menunggu Pembayaran' ? 'active' : ''}`} 
                  onClick={() => handleUserMenuClick('Menunggu Pembayaran')}
                >
                  <History/>Menunggu Pembayaran
                </div>
                <div 
                  className={`opsi-user sub-opsi ${activeUserMenu === 'Riwayat Transaksi' ? 'active' : ''}`} 
                  onClick={() => handleUserMenuClick('Riwayat Transaksi')}
                >
                  <ClipboardClock />Riwayat Transaksi
                </div>
              </div>
            </div>

            <div 
              className={`opsi-user ${activeUserMenu === 'Wishlist' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Wishlist')}
            >
              <ShoppingBag /> Keranjang Saya
            </div>

            <div 
              className={`opsi-user ${activeUserMenu === 'Ulasan Saya' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Ulasan Saya')}
            >
              <CircleStar /> Ulasan Saya
            </div>
          </div>
        </div>

        {/* AREA KONTEN KANAN */}
        <div className='content-user' style={{ flex: 1, padding: '40px' }}>
          {activeUserMenu === 'Dashboard' && <UserDashMain /> }
          {activeUserMenu === 'Profile Saya' && <UserProfile />}
          {/* {activeUserMenu === 'Menunggu Pembayaran' && <MenungguPembayaran />}
          {activeUserMenu === 'Riwayat Transaksi' && <RiwayatTransaksi />} */}
          {activeUserMenu === 'Wishlist' && <CartComp />}
          {/* {activeUserMenu === 'Ulasan Saya' && <UlasanSaya />} */}
        </div>

      </div>
    </div>
  );
}