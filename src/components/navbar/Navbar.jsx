import React, { useState, useEffect } from "react";
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import Profilecard from "../profilecard/Profilecard";
import CategoryBar from "./categoryBar"; 

export default function Navbar({ search, setSearch }) {
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0); // STATE BARU: Untuk menyimpan jumlah keranjang
  const navigate = useNavigate();

  // Fungsi untuk menghitung ulang jumlah keranjang
  const calculateCartCount = () => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser); // Sekaligus set user

      // Cek apakah ada data keranjang
      if (parsedUser.dashboardData && parsedUser.dashboardData.shoppingCart) {
        const cart = parsedUser.dashboardData.shoppingCart;
        let totalQty = 0;
        
        // Menjumlahkan seluruh kuantitas (qty) produk dari semua toko
        if (cart.stores) {
          cart.stores.forEach(store => {
            store.products.forEach(item => {
              totalQty += item.quantity;
            });
          });
        }
        setCartCount(totalQty);
      } else {
        setCartCount(0);
      }
    } else {
      setUser(null);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Hitung saat Navbar pertama kali dimuat
    calculateCartCount();

    // Dengarkan event 'cartUpdated' agar bisa update realtime tanpa refresh
    window.addEventListener('cartUpdated', calculateCartCount);

    // Bersihkan listener saat komponen dilepas
    return () => {
      window.removeEventListener('cartUpdated', calculateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    navigate('/');
    window.location.reload(); 
  };
  
  return (
    <header className="nav-container">
        <section className="navbar">
            <Link to='/'>
                <img className="logo" src='/asset/images/komotia.png' height="35" alt="Logo" />
            </Link>
            
            <section className="">
                <form className="search-section" onSubmit={(e) => {
                    e.preventDefault();
                    if (search.trim()) {
                        navigate(`/search?q=${encodeURIComponent(search.trim())}`);
                    }
                }}>
                    <img src='/asset/images/search-icon.png' alt="search" className="search-icon" height='17'/>
                    <input
                      type="text"
                      placeholder="Cari produk..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="search-input"
                    />
                </form>
            </section>
            
            <Link to='/cart'>
                <section className='cartBox'>
                    <img className='cart' src='/asset/images/2.png' height="25" alt="Cart" />
                    {/* IMPLEMENTASI CART COUNT */}
                    <p className="cart-num">{cartCount}</p>
                </section>
            </Link>
            
            <section className='Account'>
                {user ? (
                    <Profilecard user={user} onLogout={handleLogout} />
                ) : (
                    <>
                        <img className="reg-icon" src='/asset/images/profile.png' height="30" alt="Profile" />
                        <Link to="/login" className="log-btn">
                            Masuk
                        </Link>
                        <Link to="/register">
                            <button className="reg-btn">Daftar Sekarang</button>
                        </Link>
                    </>
                )}
            </section>
        </section>

        <CategoryBar />
    </header>
  );
}