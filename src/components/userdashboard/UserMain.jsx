import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMain.css';
import UserProfile from './UserProfile';
import UserDashMain from './UserDashMain';
import UserOrderHistory from './UserOrderHistory';
import UserWaiting from './UserWaitingPayment';
import UserReview from './UserReview';
import { LayoutDashboard, UserRound, PackageOpen, History, ClipboardClock, ShoppingBag, CircleStar, LogOut } from 'lucide-react';
import CartComp from '../cartcomponent/CartMain';

// Import hooks baru
import { useUserData } from '../../hooks/useUserData';
import { useUserOrders } from '../../hooks/useUserOrders';
import { useUserReviews } from '../../hooks/useUserReviews';

export default function UserMain() {
  const [userId, setUserId] = useState(null);
  const [isPesananOpen, setIsPesananOpen] = useState(false);
  const [activeUserMenu, setActiveUserMenu] = useState('Dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUserData = localStorage.getItem('user');
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData);
      if (parsedUser.id_user) {
        setUserId(parsedUser.id_user);
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data from Supabase via hooks
  const { userData, loading: userLoading } = useUserData(userId);
  const { orders, loading: ordersLoading } = useUserOrders(userId);
  const { waitingList, historyList, loading: reviewsLoading } = useUserReviews(userId);

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  const togglePesanan = () => {
    setIsPesananOpen(!isPesananOpen);
  };

  const handleUserMenuClick = (menuName) => {
    setActiveUserMenu(menuName);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isPesananSectionActive = activeUserMenu === 'Menunggu Pembayaran' || activeUserMenu === 'Riwayat Transaksi';

  if (userLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat data pengguna...</div>;
  }

  if (!userData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Gagal memuat data pengguna.</div>;
  }

  // Pisahkan pesanan pending (menunggu pembayaran)
  const waitingOrders = orders.filter(order => order.status === 'pending');

  return (
    <div className='container-dashboard'>
      <div className='main-user'>
        
        <div className='dashboard-side-bar'>
          <section>
            {userData.avatar_url ? (
                    <img 
                        className="reg-icon" 
                        src={userData.avatar_url} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                        alt="Profile" 
                    />
                ) : (
                    <div 
                        className="reg-icon" 
                        style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50', 
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}
                    >
                        {getInitials(userData.nama || userData.username)}
                    </div>
                )}
            <div className='dashboard-info user'>
              <h2>{userData.nama || userData.username}</h2>
              <button className='status-user'>{userData.membership}</button>
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

            <div className="opsi-user btn-logout" onClick={handleLogout} style={{ marginTop: 'auto', color: 'red' }}>
              <LogOut/> Keluar Akun
            </div>
          </div>
        </div>

        <div className='content-user' style={{ flex: 1, padding: '40px' }}>
          {activeUserMenu === 'Dashboard' && <UserDashMain data={userData} walletBalance={userData.saldo_wallet} /> }
          {activeUserMenu === 'Profile Saya' && <UserProfile data={userData} />}
          {activeUserMenu === 'Menunggu Pembayaran' && (
            ordersLoading ? <p>Memuat pesanan...</p> : <UserWaiting data={waitingOrders} />
          )}
          {activeUserMenu === 'Riwayat Transaksi' && (
             ordersLoading ? <p>Memuat pesanan...</p> : <UserOrderHistory data={orders} />
          )}
          {activeUserMenu === 'Wishlist' && <CartComp data={[]} />}
          {activeUserMenu === 'Ulasan Saya' && (
             reviewsLoading ? <p>Memuat ulasan...</p> : <UserReview waitingList={waitingList} historyList={historyList} />
          )}
        </div>

      </div>
    </div>
  );
}