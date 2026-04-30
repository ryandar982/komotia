import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import './CategoryBar.css';
import SellerCenter from '../profilecard/sellerCenter';
// import { Store, LogOut } from 'lucide-react'; // Hapus jika tidak digunakan di file ini

export default function CategoryBar() {
    return (
        <div className="catbar-container">
            <div className="catbar-content">
                
                {/* Kelompokkan bagian kiri (Kategori & Links) */}
                <div className="catbar-menu">
                    <div className="catbar-left">
                        <LayoutGrid className="catbar-icon" size={20} strokeWidth={2.5} />
                        <span className="catbar-title">Kategori</span>
                    </div>
                    
                    <div className="catbar-links">
                        <Link to="/category/pupuk">Pupuk</Link>
                        <Link to="/category/bibit">Bibit</Link>
                        <Link to="/category/pestisida">Pestisida</Link>
                        <Link to="/category/alat-pertanian">Alat Pertanian</Link>
                        <Link to="/category/perlengkapan">Perlengkapan</Link>
                    </div>
                </div>

                {/* SellerCenter sekarang ada di dalam catbar-content */}
                <div className="catbar-right">
                    <SellerCenter/>
                </div>
                
            </div>
        </div>
    );
}