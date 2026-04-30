// File: src/components/explore/Explore.js
import React from 'react'
import './Explore.css';
import Card from '../productcard/Productcard'
import { dummyProducts } from '../../data/dummyProducts';
import { Link } from "react-router-dom"; // 1. Import Link

export default function Explore() {
  return (
    <section className='container explore-container my-5'> 
        
        {/* Header */}
        <div className='row align-items-center mb-4 explore-head'>
            <div className='col-auto'>
                {/* 2. Tambahkan / agar path gambar absolut */}
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

        {/* Grid Produk */}
        <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 explore-product'>
            {dummyProducts.map((item) => (
                <div className='col' key={item.id}>
                    {/* 3. Bungkus Card dengan Link ke /product/id */}
                    <Link 
                        to={`/product/${item.id}`} 
                        className="product-link" 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <Card product={item} />
                    </Link>
                </div>
            ))}
        </div>
    </section>
  )
}