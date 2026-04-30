import { useNavigate } from 'react-router-dom';
import './authreg.css';
import React, { useState } from "react";
import { loginWithGoogle } from "../../firebase/auth.js";
import { dummyUsers } from '../../data/dummyUsers';

export default function Loginform() {
  const [form, setForm] = useState({
    username: "",
    password: ""
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
    
    // 1. Ambil database user dari localStorage (atau dummyUsers jika belum ada yang mendaftar)
    const existingUsers = JSON.parse(localStorage.getItem('users_db')) || dummyUsers;

    // 2. Cari kecocokan username dan password di dalam existingUsers
    const user = existingUsers.find(
      (u) => u.username === form.username && u.password === form.password
    );

    if (user) {
      // 3. Simpan sesi login
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
      window.location.reload();
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Masukkan akun anda</h2>

        {error && <p style={{ color: '#dc3545', fontSize: '14px', margin: '0 0 10px 0', textAlign: 'center' }}>{error}</p>}

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

        <button type="submit">
          Masuk
        </button>

        <div className="divider">
          <span>atau</span>
        </div>

        <div className="option-google" onClick={loginWithGoogle} style={{ cursor: 'pointer' }}>
          <img src="asset/images/google-logo.png" width="35" alt="Google Logo" />
          <p>Login dengan Google</p>
        </div>
      </form>
    </div>
  );
}