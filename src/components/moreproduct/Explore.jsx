import React from 'react'
import './Explore.css';
import Card from '../productcard/Productcard'

export default function Explore() {
  return (
    // 'container' otomatis memberikan padding dan max-width yang rapi
    <section className='container explore-container my-5'> 
        
        {/* Header: Menggunakan Row Bootstrap */}
        <div className='row align-items-center mb-4 explore-head'>
            <div className='col-auto'>
                <img src='asset/images/explore-icon.png' width='70' alt="Explore Icon"/>
            </div>
            <div className='col'>
                <h2 className='mb-0'>Explore produk</h2>
                <p className='mb-0 text-muted'>Rekomendasi produk terbaik</p>
            </div>
        </div>

        {/* Categories: Tetap menggunakan class categories-pick untuk logic slider-mu */}
        <div className='categories-pick d-flex gap-3 mb-4'>
            <button className="btn btn-outline-dark d-flex align-items-center gap-2">
                <img src='asset/images/free-dev.png' width='30' alt="cat1"/>
                Pupuk Organik
            </button>
            <button className="btn btn-outline-dark d-flex align-items-center gap-2">
                <img src='asset/images/free-dev.png' width='30' alt="cat2"/>
                Kategori 2
            </button>
            <button className="btn btn-outline-dark d-flex align-items-center gap-2">
                <img src='asset/images/free-dev.png' width='30' alt="cat3"/>
                Kategori 3
            </button>
            <button className="col-auto btn btn-outline-dark d-flex align-items-center gap-2">
                <img src='asset/images/free-dev.png' width='30' alt="cat4"/>
                Kategori 4
            </button>
        </div>

        {/* Grid Produk: Sangat mudah dengan row-cols */}
        {/* row-cols-2 (HP: 2 kolom), row-cols-md-3 (Tablet: 3), row-cols-lg-5 (Desktop: 5) */}
        <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 explore-product'>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
            <div className='col'><Card/></div>
        </div>
    </section>
  )
}