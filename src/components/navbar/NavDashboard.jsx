import React from 'react'
import './NavDashboard.css';
import { Link } from 'react-router';
import Profilecard from "../profilecard/Profilecard";

export default function SellerNav() {
  return (
    <div className='seller-nav-container'>
        <div className='seller-nav-main'>
            <Link className='logo-container-dashboard'to='/'>
                <img className="logo" src='asset/images/komotia.png' height="35" alt="Logo" />
            </Link>
            <Profilecard/>
        </div>
    </div>
  )
}
