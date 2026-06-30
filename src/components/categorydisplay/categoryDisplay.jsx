import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import './categoryDisplay.css';
import Card from '../productcard/Productcard';

export default function CategoryDisplay() {
    const { categoryName } = useParams();
    const { products, loading, error } = useProducts();

    // Filter produk berdasarkan kategori dari Supabase
    const filteredProducts = Array.isArray(products) 
        ? products.filter(
            (item) => item.category && item.category.toLowerCase() === categoryName.toLowerCase()
          )
        : [];

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

            {loading && (
                <div className="text-center my-5">
                    <p className="text-muted">Memuat produk kategori...</p>
                </div>
            )}

            {error && (
                <div className="text-center my-5">
                    <p className="text-danger">Gagal mengambil data: {error}</p>
                </div>
            )}

            {!loading && !error && filteredProducts.length > 0 ? (
                <div className='row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 ctg-product'>
                    {filteredProducts.map((item) => (
                        <div className='col' key={item.id_product}>
                            <Link 
                                to={`/product/${item.id_product}`} 
                                className="product-link" 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <Card product={item} />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (!loading && !error && (
                <div className="text-center py-5 w-100" style={{ backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6', borderRadius: '10px' }}>
                    <p className="text-muted fs-5 mb-3">Belum ada produk untuk kategori ini. 🌱</p>
                    <Link to="/" className="btn btn-success px-4 py-2" style={{ backgroundColor: 'rgba(75, 83, 32, 1)', borderColor: 'rgba(75, 83, 32, 1)' }}>Kembali Belanja</Link>
                </div>
            ))}
        </section>
    );
}