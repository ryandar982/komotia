import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { useProducts } from '../hooks/useProducts';
import Card from '../components/productcard/Productcard';
import '../components/categorydisplay/categoryDisplay.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [search, setSearch] = useState(query);
  const { products, loading, error } = useProducts();

  // Memfilter data produk secara lokal (case-insensitive)
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (item) => item.nama_product && item.nama_product.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Update input text saat query parameter berubah
  useEffect(() => {
    setSearch(query);
  }, [query]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      
      <section className='container ctg-container'>
        {/* Header - sama seperti halaman kategori */}
        <div className='row align-items-center mb-4 ctg-head'>
          <div className='col-auto'>
            <img src='/asset/images/explore-icon.png' width='70' alt="Search Icon" />
          </div>
          <div className='col'>
            <h2 className='mb-0' style={{ textTransform: 'capitalize' }}>
              Hasil Pencarian: {query}
            </h2>
            <p className='mb-0 text-muted'>
              Menemukan {filteredProducts.length} produk untuk "{query}"
            </p>
          </div>
        </div>

        {/* Pilihan Kategori */}
        <div className='ctg-categories-pick d-flex gap-3 mb-4'>
          <Link to="/category/pupuk">Pupuk</Link>
          <Link to="/category/bibit">Bibit</Link>
          <Link to="/category/pestisida">Pestisida</Link>
          <Link to="/category/alat-pertanian">Alat Pertanian</Link>
          <Link to="/category/perlengkapan">Perlengkapan</Link>
        </div>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Memuat produk...</span>
            </div>
            <p className="text-muted mt-3">Sedang mencari produk terbaik untukmu...</p>
          </div>
        )}

        {error && (
          <div className="text-center my-5">
            <p className="text-danger">Terjadi kesalahan saat mencari produk: {error}</p>
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
            <p className="text-muted fs-5 mb-3">Produk tidak ditemukan untuk "{query}" 😞</p>
            <p className="text-muted mb-4">Coba gunakan kata kunci lain yang lebih umum, misal: "Pupuk" atau "Bibit".</p>
            <Link to="/" className="btn btn-success px-4 py-2" style={{ backgroundColor: 'rgba(75, 83, 32, 1)', borderColor: 'rgba(75, 83, 32, 1)' }}>
              Kembali ke Beranda
            </Link>
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
};

export default Search;
