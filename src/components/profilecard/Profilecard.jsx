import React from 'react';
import './Profilecard.css';
import { Link } from "react-router-dom";
// Import ikon dari lucide-react
import { Store, LogOut } from 'lucide-react';

// Komponen Avatar (Elemen Inisial/Foto)
const Avatar = ({ user, size = '36px' }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  if (user?.profilePicture) {
    return (
      <img 
        src={user.profilePicture} 
        style={{ 
          width: size, 
          height: size, 
          borderRadius: '50%', 
          objectFit: 'cover',
          flexShrink: 0 
        }} 
        alt="Profile" 
      />
    );
  }

  return (
    <div 
      style={{
        width: size,
        height: size,
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
      {getInitials(user?.name || user?.username)}
    </div>
  );
};

function Profilecard({ user, onLogout }) {
  return (
    <div className="profile-container" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* Link Seller Center dengan Ikon Lucide */}
        {/* <Link to='/seller-dashboard' style={{ textDecoration: 'none' }}>
            <div className="buat-toko" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                <Store size={22} color="#ffffff" strokeWidth={2.5} />
                <span className="log-btn" style={{ color: '#ffffff', whiteSpace: 'nowrap', fontSize: '14px' }}>
                    Seller Center
                </span>
            </div>
        </Link> */}
        
        <Link to='/user-dashboard' style={{ textDecoration: 'none' }}>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                
                <Avatar user={user} size="36px" />

                <span 
                    className="log-btn" 
                    style={{ 
                        color: '#ffffff', 
                        whiteSpace: 'nowrap',
          
                        maxWidth: '400px',
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        fontSize: '14px'
                    }}
                    title={user?.username || 'User'}
                >
                    {user?.username || 'User'}
                </span>
            </div>
        </Link>

        <button 
            onClick={onLogout} 
            style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px', 
                borderRadius: '8px', 
                border: '1px solid #dc3545', 
                backgroundColor: 'transparent', 
                color: '#dc3545', 
                cursor: 'pointer',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                fontSize: '14px'
            }}
        >
            <LogOut size={16} />
            Keluar
        </button>
    </div>
  );
}

export default Profilecard;