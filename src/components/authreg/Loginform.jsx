import { useNavigate } from 'react-router-dom';
import './authreg.css';
import React, { useState } from "react";
import { loginWithGoogle } from "../../firebase/auth.js";
import { supabase } from '../../config/supabaseClient';

export default function Loginform() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState("username"); // 'username' atau 'email'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let query = supabase.from('users').select('*');

      if (loginMode === 'email') {
        query = query.eq('email', form.email);
      } else {
        query = query.eq('username', form.username);
      }

      const { data, error: dbError } = await query.single();

      if (dbError || !data) {
        setError(loginMode === 'email' ? "Email tidak ditemukan." : "Username tidak ditemukan.");
        return;
      }

      // WARNING: Menyimpan password dalam plain-text di database sangat tidak disarankan untuk production. 
      // Untuk tujuan latihan ini kita asumsikan plain-text matching.
      if (data.password === form.password) {
        // Simpan sesi login
        localStorage.setItem('user', JSON.stringify({
          id_user: data.id_user,
          username: data.username,
          nama: data.nama,
          role: data.role
        }));
        navigate('/');
        window.location.reload();
      } else {
        setError("Password salah!");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan sistem.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Masukkan akun anda</h2>

        {error && <p style={{ color: '#dc3545', fontSize: '14px', margin: '0 0 10px 0', textAlign: 'center' }}>{error}</p>}

        {/* Toggle Login Mode */}
        <div className="login-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${loginMode === 'username' ? 'active' : ''}`}
            onClick={() => { setLoginMode('username'); setError(''); }}
          >
            Username
          </button>
          <button
            type="button"
            className={`mode-btn ${loginMode === 'email' ? 'active' : ''}`}
            onClick={() => { setLoginMode('email'); setError(''); }}
          >
            Email
          </button>
        </div>

        {/* Input Username atau Email */}
        {loginMode === 'username' ? (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        ) : (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        )}

        {/* Input Password dengan Show/Hide */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="toggle-pw-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

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