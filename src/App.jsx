import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Opsional: kamu bisa menghapus isinya atau biarkan untuk styling global

// Import komponen yang sudah kita buat (Sesuaikan path/lokasi foldernya dengan struktur proyekmu)
import CategoryBar from './components/navbar/categoryBar'; // Contoh path
import SellerLogin from './components/sellerLogin/SellerLogin'; // Contoh path
import SellerMain from './components/sellerDashboard/SellerMain'; // Contoh path

// Membuat komponen Home sederhana sebagai tempat CategoryBar
const Home = () => {
  return (
    <div>
      <CategoryBar />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Selamat Datang di Toko Pertanian</h1>
        <p>Pilih kategori di atas atau masuk ke Seller Center.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Halaman Utama (Pembeli) */}
        <Route path="/" element={<Home />} />

        {/* Rute Halaman Login Penjual */}
        <Route path="/seller/login" element={<SellerLogin />} />

        {/* Rute Halaman Dashboard Penjual */}
        <Route path="/seller/dashboard" element={<SellerMain />} />

        {/* Catch-all route: Jika user mengetik URL yang salah, kembalikan ke Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;