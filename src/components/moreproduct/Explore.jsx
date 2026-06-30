// File: src/components/explore/Explore.js
import React from 'react'
import './Explore.css';
import Card from '../productcard/Productcard'
import { useProducts } from '../../hooks/useProducts'; // 1. Ganti dummyProducts dengan Custom Hook Supabase
import { Link } from "react-router-dom"; 

export default function Explore() {
  // 2. Panggil hook untuk mendapatkan data, status loading, dan error

  const { products, loading, error } = useProducts(); 

  // Tambahkan baris ini untuk cek isi data di console browser:
  console.log("Data produk dari Supabase:", products); 
  console.log("Status Error jika ada:", error);

  return (
    <section className='container explore-container my-5'> 
        
        {/* Header */}
        <div className='row align-items-center mb-4 explore-head'>
            <div className='col-auto'>
                <img src='/asset/images/explore-icon.png' width='70' alt="Explore Icon"/>
            </div>
            <div className='col'>
                <h2 className='mb-0'>Explore produk</h2>
                <p className='mb-0 text-muted'>Rekomendasi produk terbaik</p>
            </div>
        </div>

        {/* Categories */}
        <div className='categories-pick d-flex gap-3 mb-4'>
            {/* ... kode button kategori Anda ... */}
        </div>

        {/* 3. Handle State Loading dan Error agar UI tidak kosong/crash */}
        {loading && (
            <div className="text-center my-5">
                <p className="text-muted">Memuat produk komoditas Komotia...</p>
            </div>
        )}
        
        {error && (
            <div className="text-center my-5">
                <p className="text-danger">Gagal mengambil data: {error}</p>
            </div>
        )}

        {/* Grid Produk */}
        {!loading && !error && (
            <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 explore-product'>
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((item) => (
                        // 4. Ubah item.id menjadi item.id_product sesuai kolom database Supabase
                        <div className='col' key={item.id_product}>
                            <Link 
                                to={`/product/${item.id_product}`} 
                                className="product-link" 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {/* Properti item sekarang berisi struktur dari Postgres (nama_product, harga, dll) */}
                                <Card product={item} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center my-5 w-100">
                        <p className="text-muted">Belum ada produk untuk ditampilkan.</p>
                    </div>
                )}
            </div>
        )}
    </section>
  )
}