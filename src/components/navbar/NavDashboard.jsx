import React, { useState, useEffect } from 'react';
import './NavDashboard.css';
import { Link, useNavigate } from 'react-router-dom'; // Pastikan dari react-router-dom
import Profilecard from "../profilecard/Profilecard";

export default function SellerNav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Cek apakah ada user yang sedang login saat komponen dimuat
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      // (Opsional) Jika tidak ada user login, tendang balik ke halaman login/home
      // navigate('/login'); 
    }
  }, [navigate]);

  // Fungsi untuk Keluar/Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload(); // Refresh agar state benar-benar bersih
  };

  return (
    <div className='seller-nav-container'>
        <div className='seller-nav-main'>
            <Link className='logo-container-dashboard' to='/'>
                {/* Perbaikan path gambar dengan menambahkan garis miring di depan */}
                <img className="logo" src='/asset/images/komotia.png' height="35" alt="Logo" />
            </Link>
            
            {/* Teruskan data user dan fungsi logout ke Profilecard */}
            <Profilecard user={user} onLogout={handleLogout} />
        </div>
    </div>
  );
}