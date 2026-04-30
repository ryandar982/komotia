import React, { useState } from 'react';
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SellerLogin.css';
import { sellerData } from '../../data/sellerData'; // Sesuaikan path-nya

export default function SellerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    // Inisialisasi navigate
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        
        const validEmail = sellerData.profile.email;
        const validPassword = sellerData.profile.password;

        if (email === validEmail && password === validPassword) {
            // Jika sukses, arahkan ke halaman SellerMain (Dashboard)
            // Sesuaikan '/seller/dashboard' dengan path routing di App.jsx kamu
            navigate('/seller-dashboard'); 
        } else {
            setErrorMsg('Email atau password yang Anda masukkan salah.');
        }
    };

    return (
        <div className="seller-login-container">
            <div className="seller-login-card">
                <div className="seller-login-header">
                    <div className="seller-logo-circle">
                        <Store size={28} color="#ffffff" strokeWidth={2} />
                    </div>
                    <h2>Seller Center</h2>
                    <p>Masuk untuk mengelola toko pertanianmu</p>
                </div>

                {errorMsg && (
                    <div className="error-alert">
                        <AlertCircle size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="seller-login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email / Username</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                placeholder="Masukkan email toko"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Ingat saya</span>
                        </label>
                        <a href="#" className="forgot-password">Lupa Password?</a>
                    </div>

                    <button type="submit" className="btn-login">
                        Masuk ke Toko <ArrowRight size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}