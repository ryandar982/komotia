// File: src/components/explore/Explore.js
import React from 'react'
import './Explore.css';
import Card from '../productcard/Productcard'
import { dummyProducts } from '../../data/dummyProducts'; // Sesuaikan path-nya

export default function Explore() {
  return (
    <section className='container explore-container my-5'> 
        
        {/* Header (Tetap sama) */}
        <div className='row align-items-center mb-4 explore-head'>
            <div className='col-auto'>
                <img src='asset/images/explore-icon.png' width='70' alt="Explore Icon"/>
            </div>
            <div className='col'>
                <h2 className='mb-0'>Explore produk</h2>
                <p className='mb-0 text-muted'>Rekomendasi produk terbaik</p>
            </div>
        </div>

        {/* Categories (Tetap sama) */}
        <div className='categories-pick d-flex gap-3 mb-4'>
            {/* ... kode button kategori Anda ... */}
        </div>

        {/* Grid Produk: Gunakan .map() untuk me-render data dummy */}
        <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 explore-product'>
            {dummyProducts.map((item) => (
                // Pastikan selalu memberikan 'key' yang unik saat menggunakan map()
                <div className='col' key={item.id}>
                    {/* Lempar data item ke dalam props 'product' */}
                    <Card product={item} />
                </div>
            ))}
        </div>
    </section>
  )
}