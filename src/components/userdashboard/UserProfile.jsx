import React, { useState, useRef } from 'react';
import './UserProfile.css';
import { supabase } from '../../config/supabaseClient';

export default function UserProfile({ data }) {
  const [avatarUrl, setAvatarUrl] = useState(data?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

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
      // Buat nama file unik: userId_timestamp.ext
      const fileExt = file.name.split('.').pop();
      const fileName = `${data.id_user}_${Date.now()}.${fileExt}`;
      const filePath = `users/${fileName}`;

      // Hapus foto lama jika ada
      if (avatarUrl && avatarUrl.includes('avatars/users/')) {
        const oldPath = avatarUrl.split('avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
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

      // Update kolom avatar_url di tabel users
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id_user', data.id_user);

      if (updateError) {
        throw updateError;
      }

      // Update state lokal
      setAvatarUrl(publicUrl);

      // Update juga localStorage agar sidebar avatar ikut berubah
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.avatar_url = publicUrl;
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }

      alert('Foto profil berhasil diperbarui! 🎉');

    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengupload foto: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Tentukan sumber avatar yang ditampilkan
  const currentAvatar = avatarUrl || data?.avatar_url;

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
            <div className="pa-avatar-wrapper" onClick={handleChangePhotoClick} style={{ cursor: 'pointer' }}>
              {currentAvatar ? (
                <img 
                  src={currentAvatar} 
                  alt="Profile"
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
                  }}
                >
                  {getInitials(data?.nama || data?.username)}
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
            <p className="pa-profile-name-text">{data?.username || ''}</p>
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

          <div className="pa-profile-right">
            <div className="pa-form-group">
              <label className="pa-label">Nama Lengkap</label>
              <div className="pa-input-row">
                <input type="text" className="pa-input" defaultValue={data?.nama || ''} />
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
                <input type="text" className="pa-input" defaultValue={data?.no_telp || ''} />
                <button className="pa-btn-outline">Ubah</button>
              </div>
            </div>

            <div className="pa-form-group">
              <label className="pa-label">Alamat</label>
              <div className="pa-input-row">
                <input type="text" className="pa-input" defaultValue={data?.alamat || ''} />
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