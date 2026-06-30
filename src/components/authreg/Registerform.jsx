import { Link, useNavigate } from 'react-router-dom';
import './authreg.css';
import React, { useState } from "react";
import { loginWithGoogle } from "../../firebase/auth.js";
import { supabase } from '../../config/supabaseClient';

export default function Registerform() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error setiap kali submit

    // 1. Validasi konfirmasi password
    if (form.password !== form.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    try {
      // 2. Cek apakah username sudah dipakai
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id_user')
        .eq('username', form.username)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        setError("Username sudah digunakan, silakan pilih yang lain!");
        return;
      }

      // 3. Buat objek user baru dan insert ke Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: form.email,
            username: form.username,
            password: form.password, // TODO: Hash password di production
            nama: form.username, // Gunakan username sebagai nama default
            role: 'pembeli',
            no_telp: '-', // Default value untuk menghindari error NOT NULL
            alamat: '-'  // Default value untuk menghindari error NOT NULL
          }
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 4. Simpan sesi user ke localStorage agar langsung login
      localStorage.setItem('user', JSON.stringify({
        id_user: newUser.id_user,
        username: newUser.username,
        nama: newUser.nama,
        role: newUser.role
      }));

      // 5. Pindah ke halaman utama
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(`Terjadi kesalahan sistem saat mendaftar: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Buat akun anda sekarang</h2>

        {/* Tampilkan pesan error jika ada */}
        {error && <p style={{ color: '#dc3545', fontSize: '14px', margin: '0 0 10px 0', textAlign: 'center' }}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <label>Konfirmasi Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          onChange={handleChange}
          required
        />
        <button type="submit">
          Daftar Sekarang
        </button>
        
        <div className='option-login'>
            <p>Sudah mempunyai akun?</p>
            <Link to="/login">
            <p>masuk</p>
            </Link>
        </div>
        
        <div className="divider">
            <span>atau</span>
        </div>
        
        <div className='option-google' onClick={loginWithGoogle} style={{ cursor: 'pointer' }}>
            <img src='asset/images/google-logo.png' width='35' alt='Google Logo' />
            <p>Daftar dengan Google</p>
        </div>
      </form>
    </div>
  );
}