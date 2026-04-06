import React, { useState } from "react";
import './Navbar.css';
import { Link } from "react-router-dom";
import Profilecard from "../profilecard/Profilecard";

export default function Navbar({ search, setSearch }) {
  const [showOptions,setShowOptions] = useState(false);
  return (
    <header className="nav-container">
        <section className="navbar">
            <Link to='/'>
                <img className="logo" src='asset/images/komotia.png' height="35" alt="Logo" />
            </Link>
            <section classaName="">
                <section className="search-section">
                    <img src='asset/images/search-icon.png' alt="search" className="search-icon" height='17'/>
                    <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                    />
                </section>
                <section className='more'>
                    <div className="more-btn" style={{ cursor: 'pointer' }} onClick={() => setShowOptions(!showOptions)}>
                    <img className='more-btn' src='asset/images/more.png' height="20" alt="More"/>
                    </div>
                    {showOptions && (
                    <nav className='option-list'>
                        <a className='kategori-head'><h3>Kategori Pupuk</h3></a>
                        <a href="/pupuk-organic">Pupuk Organik</a>
                        <a href="/pupuk-anorganic">Pupuk Anorganik</a>
                        <a className='kategori-head'><h3>Pestisida</h3></a>
                        <a href="/inteksida">Insektisida</a>
                        <a href="/fungisida">Fungisida</a>
                        <a href="/herbisida">Herbisida</a>
                        <a className='kategori-head'><h3>Kategori Lainnya</h3></a>
                        <a href="/benih">Benih & Bibit</a>
                        <a href="/budidaya">Perlengkapan Budidaya</a>
                        <a href="/alat">Alat dan Mesin Pertanian</a>
                    </nav>
                    )}
                </section>
            </section>
            <Link to='/cart'>
                <section className='cartBox'>
                    <img className='cart' src='asset/images/2.png' height="25" alt="Cart" />
                    <p className="cart-num">0</p>
                </section>
            </Link>
            <section className='Account'>
                <Profilecard/> 
                {/* <img href="/cart" className="reg-icon" src='asset/images/profile.png' height="30" alt="Profile" />
                <Link to="/login">
                    <a className="log-btn" href=''>Masuk</a>
                </Link>
                <Link to="/register">
                    <button className="reg-btn" href='/register'>Daftar Sekarang</button>
                </Link> */}
            </section>
            
            
        </section>
    </header>
  );
}