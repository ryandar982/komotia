import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyProducts } from '../../data/dummyProducts';
import './categoryDisplay.css';
import Card from '../productcard/Productcard';

export default function CategoryDisplay() {
    const { categoryName } = useParams();

    const filteredProducts = dummyProducts.filter(
        (item) => item.category.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <section className='container ctg-container '> 
            <div className='row align-items-center mb-4 ctg-head'>
                <div className='col-auto'>
                    <img src='/asset/images/explore-icon.png' width='70' alt="Category Icon"/>
                </div>
                <div className='col'>
                    <h2 className='mb-0' style={{ textTransform: 'capitalize' }}>
                        Kategori: {categoryName}
                    </h2>
                    <p className='mb-0 text-muted'>Menampilkan rekomendasi produk terbaik</p>
                </div>
            </div>

            <div className='ctg-categories-pick d-flex gap-3 mb-4'>
                <Link to="/category/pupuk">Pupuk</Link>
                <Link to="/category/bibit">Bibit</Link>
                <Link to="/category/pestisida">Pestisida</Link>
                <Link to="/category/alat-pertanian">Alat Pertanian</Link>
                <Link to="/category/perlengkapan">Perlengkapan</Link>
            </div>

            {filteredProducts.length > 0 ? (
                <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 ctg-product'>
                    {filteredProducts.map((item) => (
                        <div className='col' key={item.id}>
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
            ) : (
                <div className="text-center py-5 w-100" style={{ backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '10px' }}>
                    <p className="text-muted fs-5 mb-3">Belum ada produk untuk kategori ini. 🌱</p>
                    <Link to="/" className="btn btn-success px-4 py-2" style={{ backgroundColor: 'rgba(75, 83, 32, 1)', borderColor: 'rgba(75, 83, 32, 1)' }}>Kembali Belanja</Link>
                </div>
            )}
        </section>
    );
}