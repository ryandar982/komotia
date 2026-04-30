import React from 'react';
import './PengaturanProfile.css';

export default function PengaturanAkun({ profile }) {
  // Antisipasi jika data profile belum ter-load
  if (!profile) return null;

  return (
    <div className="pa-container">
      <div className="pa-header">
        <h2 className="pa-title">Pengaturan Akun</h2>
        <p className="pa-subtitle">Kelola profil dan preferensi Anda</p>
      </div>

      {/* SECTION: PROFIL SAYA */}
      <div className="pa-section">
        <h3 className="pa-section-title">Profil Toko Saya</h3>
        
        <div className="pa-profile-content">
          {/* Kiri: Foto Profil */}
          <div className="pa-profile-left">
            <div className="pa-avatar-wrapper">
              <img 
                src={profile.avatarUrl} 
                alt={`Profile ${profile.storeName}`} 
                className="pa-avatar" 
              />
              <div className="pa-edit-badge">
                <span>✏️</span>
              </div>
            </div>
            <p className="pa-profile-name-text">{profile.ownerName}</p>
            <a href="#ubahfoto" className="pa-change-photo-link">Ubah Foto</a>
          </div>

          {/* Kanan: Form Profil */}
          <div className="pa-profile-right">
            <div className="pa-form-group">
              <label className="pa-label">Nama Toko</label>
              <div className="pa-input-row">
                <input 
                  type="text" 
                  className="pa-input" 
                  defaultValue={profile.storeName} 
                />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Alamat Email</label>
              <div className="pa-input-row">
                <input 
                  type="email" 
                  className="pa-input pa-input-disabled" 
                  defaultValue={profile.email} 
                  readOnly 
                />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Lokasi Toko</label>
              <div className="pa-input-row">
                <input 
                  type="text" 
                  className="pa-input" 
                  defaultValue={profile.address} 
                />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: NOTIFIKASI */}
      

      {/* TOMBOL SIMPAN */}
      <div className="pa-footer">
        <button className="pa-btn-primary">Simpan Perubahan</button>
      </div>
    </div>
  );
}