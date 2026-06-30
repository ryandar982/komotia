import React, { useState, useRef, useEffect } from 'react';
import './PengaturanProfile.css';
import { supabase } from '../../config/supabaseClient';

export default function PengaturanAkun({ profile }) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Controlled states for form
  const [storeName, setStoreName] = useState(profile?.storeName || '');
  const [address, setAddress] = useState(profile?.address || '');

  const fileInputRef = useRef(null);

  // Sync state if profile prop changes
  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.avatarUrl || '');
      setStoreName(profile.storeName || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  // Antisipasi jika data profile belum ter-load
  if (!profile) return null;

  const getInitials = (name) => {
    if (!name) return 'S';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  const currentAvatar = avatarUrl || profile.avatarUrl;

  // Handler klik tombol "Ubah Foto"
  const handleChangePhotoClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  // Handler upload file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan PNG, JPG, atau WebP.');
      return;
    }

    // Validasi ukuran (maks 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB.');
      return;
    }

    setUploading(true);

    try {
      // Buat nama file unik: sellerId_timestamp.ext
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id_seller}_${Date.now()}.${fileExt}`;
      const filePath = `sellers/${fileName}`;

      // Hapus foto lama jika ada (opsional, biar storage tidak menumpuk)
      if (avatarUrl && avatarUrl.includes('avatars/sellers/')) {
        const oldPath = avatarUrl.split('avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`sellers/${oldPath.split('sellers/')[1]}`]);
        }
      }

      // Upload ke Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Dapatkan public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update kolom avatar_url di tabel sellers
      const { error: updateError } = await supabase
        .from('sellers')
        .update({ avatar_url: publicUrl })
        .eq('id_seller', profile.id_seller);

      if (updateError) {
        throw updateError;
      }

      // Update state lokal
      setAvatarUrl(publicUrl);
      alert('Foto profil berhasil diperbarui! 🎉');
      window.location.reload();

    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengupload foto: ' + err.message);
    } finally {
      setUploading(false);
      // Reset input agar bisa upload file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('sellers')
        .update({
          nama_toko: storeName,
          alamat: address,
        })
        .eq('id_seller', profile.id_seller);

      if (error) throw error;
      
      alert('Perubahan berhasil disimpan! 🎉');
      window.location.reload();
    } catch (err) {
      console.error('Save error:', err);
      alert('Gagal menyimpan perubahan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="pa-avatar-wrapper" onClick={handleChangePhotoClick} style={{ cursor: 'pointer' }}>
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt={`Profile ${profile.storeName}`} 
                  className="pa-avatar" 
                />
              ) : (
                <div 
                  className="pa-avatar" 
                  style={{
                    backgroundColor: '#4CAF50', 
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%'
                  }}
                >
                  {getInitials(profile.storeName)}
                </div>
              )}
              {/* Overlay saat hover */}
              <div className={`pa-avatar-overlay ${uploading ? 'uploading' : ''}`}>
                {uploading ? (
                  <div className="pa-upload-spinner"></div>
                ) : (
                  <span>📷</span>
                )}
              </div>
              <div className="pa-edit-badge">
                <span>✏️</span>
              </div>
            </div>
            <p className="pa-profile-name-text">{profile.ownerName}</p>
            <a href="#ubahfoto" className="pa-change-photo-link" onClick={handleChangePhotoClick}>
              {uploading ? 'Mengupload...' : 'Ubah Foto'}
            </a>
            {/* Input file tersembunyi */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {/* Kanan: Form Profil */}
          <div className="pa-profile-right">
            <div className="pa-form-group">
              <label className="pa-label">Nama Toko</label>
              <div className="pa-input-row">
                <input 
                  type="text" 
                  className="pa-input" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
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
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Lokasi Toko</label>
              <div className="pa-input-row">
                <input 
                  type="text" 
                  className="pa-input" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOMBOL SIMPAN */}
      <div className="pa-footer">
        <button 
          className="pa-btn-primary" 
          onClick={handleSaveChanges} 
          disabled={isSaving}
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}