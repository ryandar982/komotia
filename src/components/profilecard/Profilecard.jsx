import React from 'react'
import './Profilecard.css'

function Profilecard() {
  return (
    <div className="profile-container">
        <div className="buat-toko">
        <img href="/cart" className="reg-icon" src='asset/images/shop-add.png' height="30" alt="Profile" />
        <a className="log-btn" href="">Buat Toko</a>
        </div>
        <div className="user-profile">
        <img href="/cart" className="reg-icon" src='asset/images/profile.png' height="30" alt="Profile" />
        <a className="log-btn" href="">ElMenchoShopping</a>
        </div>
    </div>
  )
}

export default Profilecard