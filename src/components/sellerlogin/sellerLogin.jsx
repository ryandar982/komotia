import React, { useState } from 'react';
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SellerLogin.css';
import { supabase } from '../../config/supabaseClient';

export default function SellerLogin() {
    const [isRegister, setIsRegister] = useState(false);

    // ===== LOGIN STATE =====
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ===== REGISTER STATE =====
    const [regForm, setRegForm] = useState({
        namaToko: '',
        namaPemilik: '',
        email: '',
        kota: '',
        alamat: '',
        password: '',
        confirmPassword: '',
    });
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirm, setShowRegConfirm] = useState(false);
    const [regError, setRegError] = useState('');
    const [regLoading, setRegLoading] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);

    const navigate = useNavigate();

    // ===== LOGIN HANDLER =====
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from('sellers')
                .select('id_seller, email, password_hash')
                .eq('email', email)
                .single();

            if (error || !data) {
                console.error("Supabase Error Details:", error);
                setErrorMsg(`Login Gagal. Detail: ${error?.message || 'Data tidak ditemukan'}`);
                setIsLoading(false);
                return;
            }

            if (password === data.password_hash) {
                localStorage.setItem('sellerId', data.id_seller);
                navigate('/seller-dashboard');
            } else {
                setErrorMsg('Email atau password yang Anda masukkan salah.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Terjadi kesalahan sistem.');
        } finally {
            setIsLoading(false);
        }
    };

    // ===== REGISTER HANDLER =====
    const handleRegChange = (e) => {
        setRegForm({ ...regForm, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegLoading(true);

        // Validasi password
        if (regForm.password !== regForm.confirmPassword) {
            setRegError('Password dan Konfirmasi Password tidak sama!');
            setRegLoading(false);
            return;
        }

        if (regForm.password.length < 6) {
            setRegError('Password minimal 6 karakter!');
            setRegLoading(false);
            return;
        }

        try {
            // Cek apakah email sudah dipakai
            const { data: existingSeller, error: checkError } = await supabase
                .from('sellers')
                .select('id_seller')
                .eq('email', regForm.email)
                .maybeSingle();

            if (checkError) {
                throw checkError;
            }

            if (existingSeller) {
                setRegError('Email sudah terdaftar sebagai seller! Silakan gunakan email lain.');
                setRegLoading(false);
                return;
            }

            // Insert seller baru
            const { data: newSeller, error: insertError } = await supabase
                .from('sellers')
                .insert([
                    {
                        nama_toko: regForm.namaToko,
                        nama_pemilik: regForm.namaPemilik,
                        email: regForm.email,
                        password_hash: regForm.password, // TODO: Hash password di production
                        kota: regForm.kota,
                        alamat: regForm.alamat,
                        is_open: true,
                        saldo_toko: 0,
                        transaksi_berjalan: 0,
                        perlu_diproses: 0,
                        menunggu_konfirmasi: 0,
                        kendala_layanan: 0,
                        sedang_dibatalkan: 0,
                        sedang_dikirim: 0,
                        stok_habis: 0,
                        jumlah_pembeli: 0,
                        pesanan_selesai: 0,
                        pesanan_dibatalkan: 0,
                    }
                ])
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // Tampilkan sukses, lalu pindah ke login
            setRegSuccess(true);
            setTimeout(() => {
                setRegSuccess(false);
                setIsRegister(false);
                // Pre-fill email di login form
                setEmail(regForm.email);
                setPassword('');
                setRegForm({
                    namaToko: '',
                    namaPemilik: '',
                    email: '',
                    kota: '',
                    alamat: '',
                    password: '',
                    confirmPassword: '',
                });
            }, 2000);
        } catch (err) {
            console.error(err);
            setRegError(`Terjadi kesalahan sistem: ${err.message || 'Unknown error'}`);
        } finally {
            setRegLoading(false);
        }
    };

    // ===== TOGGLE VIEW =====
    const switchToRegister = () => {
        setIsRegister(true);
        setErrorMsg('');
        setRegError('');
        setRegSuccess(false);
    };

    const switchToLogin = () => {
        setIsRegister(false);
        setErrorMsg('');
        setRegError('');
        setRegSuccess(false);
    };

    // ===== REGISTER VIEW =====
    if (isRegister) {
        return (
            <div className="seller-login-container">
                <div className="seller-login-card seller-register-card">
                    <div className="seller-login-header">
                        <div className="seller-logo-circle seller-logo-register">
                            <Building2 size={28} color="#ffffff" strokeWidth={2} />
                        </div>
                        <h2>Buka Toko di Komotia</h2>
                        <p>Daftarkan tokomu dan mulai berjualan produk pertanian</p>
                    </div>

                    {regSuccess && (
                        <div className="success-alert">
                            <CheckCircle2 size={18} />
                            <span>Pendaftaran berhasil! Mengarahkan ke halaman login...</span>
                        </div>
                    )}

                    {regError && (
                        <div className="error-alert">
                            <AlertCircle size={18} />
                            <span>{regError}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="seller-login-form">
                        <div className="form-group">
                            <label htmlFor="namaToko">Nama Toko</label>
                            <div className="input-wrapper">
                                <Store className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="namaToko"
                                    name="namaToko"
                                    placeholder="Contoh: Tani Makmur Store"
                                    value={regForm.namaToko}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="namaPemilik">Nama Pemilik</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="namaPemilik"
                                    name="namaPemilik"
                                    placeholder="Nama lengkap pemilik toko"
                                    value={regForm.namaPemilik}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="regEmail">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="regEmail"
                                    name="email"
                                    placeholder="Email untuk login seller"
                                    value={regForm.email}
                                    onChange={handleRegChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="kota">Kota</label>
                                <div className="input-wrapper">
                                    <MapPin className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        id="kota"
                                        name="kota"
                                        placeholder="Kota toko"
                                        value={regForm.kota}
                                        onChange={handleRegChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="alamat">Alamat Lengkap</label>
                            <div className="input-wrapper input-wrapper-textarea">
                                <MapPin className="input-icon input-icon-textarea" size={18} />
                                <textarea
                                    id="alamat"
                                    name="alamat"
                                    placeholder="Alamat lengkap toko"
                                    value={regForm.alamat}
                                    onChange={handleRegChange}
                                    rows="2"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="regPassword">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showRegPassword ? "text" : "password"}
                                    id="regPassword"
                                    name="password"
                                    placeholder="Minimal 6 karakter"
                                    value={regForm.password}
                                    onChange={handleRegChange}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                >
                                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Konfirmasi Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showRegConfirm ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Ulangi password"
                                    value={regForm.confirmPassword}
                                    onChange={handleRegChange}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowRegConfirm(!showRegConfirm)}
                                >
                                    {showRegConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-login btn-register" disabled={regLoading || regSuccess}>
                            {regLoading ? 'Mendaftarkan...' : (
                                <>Daftarkan Toko <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="seller-login-footer">
                        <p>Sudah punya akun seller? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Masuk di sini</a></p>
                    </div>
                </div>
            </div>
        );
    }

    // ===== LOGIN VIEW =====
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

                <form onSubmit={handleLoginSubmit} className="seller-login-form">
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

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Memuat...' : (
                            <>Masuk ke Toko <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div className="seller-login-footer">
                    <p>Belum punya toko? <a href="#" onClick={(e) => { e.preventDefault(); switchToRegister(); }}>Daftar sekarang</a></p>
                </div>
            </div>
        </div>
    );
}