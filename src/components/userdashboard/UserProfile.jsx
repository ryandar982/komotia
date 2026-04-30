import React from 'react';
import './UserProfile.css';

export default function UserProfile({ data }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };
  return (
    <div className="pa-container">
      <div className="pa-header">
        <h2 className="pa-title">Pengaturan Akun</h2>
        <p className="pa-subtitle">Kelola profil dan preferensi Anda</p>
      </div>

      <div className="pa-section">
        <h3 className="pa-section-title">Profil Saya</h3>
        
        <div className="pa-profile-content">
          <div className="pa-profile-left">
            <div className="pa-avatar-wrapper">
              {data?.profilePicture ? (
                    <img 
                        className="reg-icon" 
                        src={data?.profilePicture} 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
                        alt="Profile" 
                    />
                ) : (
                    <div 
                        className="reg-icon" 
                        style={{
                            width: '100px', // Diperbesar
                            height: '100px', // Diperbesar
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50', 
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '60px', // Font diperbesar agar proporsional
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}
                    >
                        {getInitials(data?.fullName)}
                    </div>
                )}
              <div className="pa-edit-badge">
                <span>✏️</span>
              </div>
            </div>
            <p className="pa-profile-name-text">{data?.username || ''}</p>
            <a href="#ubahfoto" className="pa-change-photo-link">Ubah Foto</a>
          </div>

          <div className="pa-profile-right">
            <div className="pa-form-group">
              <label className="pa-label">Nama Lengkap</label>
              <div className="pa-input-row">
                <input type="text" className="pa-input" defaultValue={data?.fullName || ''} />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Alamat Email</label>
              <div className="pa-input-row">
                <input 
                  type="email" 
                  className="pa-input pa-input-disabled" 
                  defaultValue={data?.email || ''} 
                  readOnly 
                />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">No Telepon</label>
              <div className="pa-input-row">
                <input type="text" className="pa-input" defaultValue={data?.phone || ''} />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Alamat</label>
              <div className="pa-input-row">
                <input type="text" className="pa-input" defaultValue={data?.mainAddress || ''} />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pa-footer">
        <button className="pa-btn-primary">Simpan Perubahan</button>
      </div>
    </div>
  );
}