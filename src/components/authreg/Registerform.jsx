import { Link, useNavigate } from 'react-router-dom';
import './authreg.css';
import React, { useState } from "react";
import { loginWithGoogle } from "../../firebase/auth.js";
import { dummyUsers } from '../../data/dummyUsers';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error setiap kali submit

    // 1. Validasi konfirmasi password
    if (form.password !== form.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    // 2. Ambil database user dari localStorage, jika kosong gunakan dummyUsers bawaan
    const existingUsers = JSON.parse(localStorage.getItem('users_db')) || dummyUsers;

    // 3. Cek apakah username sudah dipakai
    const userExists = existingUsers.find((u) => u.username === form.username);
    if (userExists) {
      setError("Username sudah digunakan, silakan pilih yang lain!");
      return;
    }

    // 4. Buat objek user baru
    const newUser = {
      id: existingUsers.length + 1, // ID urut
      email: form.email,
      username: form.username,
      password: form.password
    };

    // 5. Tambahkan user baru ke array database
    existingUsers.push(newUser);

    // 6. SIMPAN array yang sudah diupdate ke localStorage (sebagai Database)
    localStorage.setItem('users_db', JSON.stringify(existingUsers));

    // 7. Simpan sesi user ke localStorage agar langsung login (Sesi Aktif)
    localStorage.setItem('user', JSON.stringify(newUser));

    // 8. Pindah ke halaman utama
    navigate('/');
    window.location.reload();
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