import React, { useState, useEffect } from 'react';
import './NavDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import Profilecard from "../profilecard/Profilecard";
import { useSellerData } from '../../hooks/useSellerData';

export default function NavDashboard({ type = 'user' }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get seller data if type is seller
  const sellerId = type === 'seller' ? localStorage.getItem('sellerId') : null;
  const { seller } = useSellerData(sellerId);

  // Cek apakah ada user yang sedang login saat komponen dimuat
  useEffect(() => {
    if (type === 'user') {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    }
  }, [type]);

  // Fungsi untuk Keluar/Logout
  const handleLogout = () => {
    if (type === 'seller') {
      localStorage.removeItem('sellerId');
      navigate('/seller-login');
    } else {
      localStorage.removeItem('user');
      navigate('/');
    }
    window.location.reload();
  };

  // Persiapkan data profil berdasarkan tipe
  const profileData = type === 'seller' && seller ? {
    username: seller.nama_toko,
    avatar_url: seller.avatar_url,
    link: '/seller-dashboard'
  } : {
    ...(user || {}),
    link: '/user-dashboard'
  };

  return (
    <div className='seller-nav-container'>
        <div className='seller-nav-main'>
            <Link className='logo-container-dashboard' to='/'>
                <img className="logo" src='/asset/images/komotia.png' height="35" alt="Logo" />
            </Link>
            
            <Profilecard user={profileData} onLogout={handleLogout} />
        </div>
    </div>
  );
}