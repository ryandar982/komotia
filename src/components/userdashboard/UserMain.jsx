import React, { useState, useEffect } from 'react';
import './UserMain.css';
import UserProfile from './UserProfile';
import UserDashMain from './UserDashMain';
import UserOrderHistory from './UserOrderHistory';
import UserWaiting from './UserWaitingPayment';
import UserReview from './UserReview';
import { LayoutDashboard, UserRound, PackageOpen, History, ClipboardClock, ShoppingBag, CircleStar } from 'lucide-react';
import CartComp from '../cartcomponent/CartMain';
import { dummyUsers } from "../../data/dummyUsers";

export default function UserMain() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPesananOpen, setIsPesananOpen] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState('Dashboard');

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    const savedUserData = localStorage.getItem('user');
    
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData);
      const foundUser = dummyUsers.find(user => user.username === parsedUser.username);
      
      if (foundUser && foundUser.dashboardData) {
        setCurrentUser(foundUser.dashboardData);
      }
    } else {
      const defaultUser = dummyUsers.find(user => user.username === 'ryandar');
      if (defaultUser && defaultUser.dashboardData) {
        setCurrentUser(defaultUser.dashboardData);
      }
    }
  }, []);

  const togglePesanan = () => {
    setIsPesananOpen(!isPesananOpen);
  };

  const handleUserMenuClick = (menuName) => {
    setActiveUserMenu(menuName);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isPesananSectionActive = activeUserMenu === 'Menunggu Pembayaran' || activeUserMenu === 'Riwayat Transaksi';

  if (!currentUser) {
    return <div style={{ padding: '40px' }}>Memuat data...</div>;
  }

  const { userProfile } = currentUser;

  return (
    <div className='container-dashboard'>
      <div className='main-user'>
        
        <div className='dashboard-side-bar'>
          <section>
            {userProfile.profilePicture ? (
                    <img 
                        className="reg-icon" 
                        src={userProfile.profilePicture} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                        alt="Profile" 
                    />
                ) : (
                    <div 
                        className="reg-icon" 
                        style={{
                            width: '50px', // Diperbesar
                            height: '50px', // Diperbesar
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50', 
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px', // Font diperbesar agar proporsional
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}
                    >
                        {getInitials(userProfile.fullName)}
                    </div>
                )}
            <div className='dashboard-info user'>
              <h2>{userProfile.fullName}</h2>
              <button className='status-user'>{userProfile.membership}</button>
            </div>
          </section>
          
          <div className='opsi-user-container'>
            <div 
              className={`opsi-user ${activeUserMenu === 'Dashboard' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Dashboard')}
            >
              <LayoutDashboard /> Dashboard
            </div>
            
            <div 
              className={`opsi-user ${activeUserMenu === 'Profile Saya' ? 'active' : ''}`} 
              onClick={() => handleUserMenuClick('Profile Saya')}
            >
              <UserRound /> Profile Saya
            </div>
            
            <div 
              className={`opsi-user ${isPesananSectionActive ? 'active' : ''}`} 
              onClick={togglePesanan} 
            >
              <PackageOpen/>Pesanan Saya
              <span className={`arrow-icon ${isPesananOpen ? 'open' : ''}`}></span> 
            </div>

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

            <div className="opsi-user" onClick={handleLogout} style={{ marginTop: '20px', color: 'red' }}>
              Keluar Akun
            </div>
          </div>
        </div>

        <div className='content-user' style={{ flex: 1, padding: '40px' }}>
          {activeUserMenu === 'Dashboard' && <UserDashMain data={currentUser.dashboardSummary} walletBalance={userProfile.walletBalance} /> }
          {activeUserMenu === 'Profile Saya' && <UserProfile data={userProfile} />}
          {activeUserMenu === 'Menunggu Pembayaran' && <UserWaiting data={currentUser.waitingForPaymentList} />}
          {activeUserMenu === 'Riwayat Transaksi' && <UserOrderHistory data={currentUser.orderHistory} />}
          {activeUserMenu === 'Wishlist' && <CartComp data={currentUser.shoppingCart} />}
          {activeUserMenu === 'Ulasan Saya' && <UserReview data={currentUser.reviews} />}
        </div>

      </div>
    </div>
  );
}