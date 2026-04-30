import React from 'react';
import { Store, LogOut } from 'lucide-react';
import { Link } from "react-router-dom";

export default function sellerCenter() {
  return (
    <Link to='/seller-dashboard' style={{ textDecoration: 'none' }}>
                            <div className="buat-toko" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                
                                <Store size={22} color="#ffffff" strokeWidth={2.5} />
                                <span className="log-btn" style={{ color: '#ffffff', whiteSpace: 'nowrap', fontSize: '14px' }}>
                                    Seller Center 
                    </span>
        </div>
    </Link>
  )
}
