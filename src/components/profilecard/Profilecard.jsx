import React from 'react'
import './Profilecard.css'
import { Link } from "react-router-dom";

function Profilecard() {
  return (
    <div className="profile-container">
        <Link to='/seller-dashboard'>
        <div className="buat-toko">
        <img href="/cart" className="reg-icon" src='asset/images/shop-add.png' height="30" alt="Profile" />
        <a className="log-btn" href="/seller-dashboard">Buat Toko</a>
        </div>
        </Link>
        <Link to='/user-dashboard'>
        <div className="user-profile">
        <img href="/cart" className="reg-icon" src='asset/images/profile.png' height="30" alt="Profile" />
        <a className="log-btn" href="">Bang Doel</a>
        </div>
        </Link>
    </div>
  )
}

export default Profilecard