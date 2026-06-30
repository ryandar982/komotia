import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import Card from '../productcard/Productcard';
import './StorePage.css';
import { 
  MapPin, Star, Package, CalendarDays, 
  Store, MessageCircle, Search 
} from 'lucide-react';

export default function StorePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');

  useEffect(() => {
    async function fetchStoreData() {
      try {
        setLoading(true);

        // Fetch seller info
        const { data: sellerData, error: sellerError } = await supabase
          .from('sellers')
          .select('*')
          .eq('id_seller', sellerId)
          .single();

        if (sellerError) throw sellerError;
        setSeller(sellerData);

        // Fetch seller products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('id_seller', sellerId)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

      } catch (err) {
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) fetchStoreData();
  }, [sellerId]);

  if (loading) {
    return (
      <div className="sp-loading">
        <div className="sp-loading-spinner"></div>
        <p>Memuat halaman toko...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="sp-not-found">
        <Store size={64} strokeWidth={1} />
        <h2>Toko tidak ditemukan</h2>
        <p>Toko yang Anda cari mungkin sudah tidak ada atau URL salah.</p>
        <Link to="/" className="sp-btn-home">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Hitung statistik toko
  const totalProducts = products.length;
  const avgRating = products.length > 0
    ? (products.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / products.length).toFixed(1)
    : '0.0';
  const joinDate = seller.created_at
    ? new Date(seller.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '-';

  // Kategori unik dari produk seller
  const categories = ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter dan sort produk
  let filteredProducts = [...products];

  // Filter by tab/category
  if (activeTab !== 'Semua') {
    filteredProducts = filteredProducts.filter(p => p.category === activeTab);
  }

  // Filter by search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      (p.nama_product || '').toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'termurah') {
    filteredProducts.sort((a, b) => (a.harga || a.price || 0) - (b.harga || b.price || 0));
  } else if (sortBy === 'termahal') {
    filteredProducts.sort((a, b) => (b.harga || b.price || 0) - (a.harga || a.price || 0));
  } else if (sortBy === 'terlaris') {
    filteredProducts.sort((a, b) => (b.jumlah_ulasan || 0) - (a.jumlah_ulasan || 0));
  }
  // default: terbaru (already sorted by created_at desc from query)

  return (
    <div className="sp-container">
      {/* ===== STORE HEADER ===== */}
      <div className="sp-header">
        <div className="sp-header-bg"></div>
        <div className="sp-header-content">
          <div className="sp-header-left">
            <div className="sp-avatar">
              {seller.avatar_url ? (
                <img
                  src={seller.avatar_url}
                  alt={seller.nama_toko}
                  onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="sp-avatar-fallback">🏪</span>'; }}
                />
              ) : (
                <span className="sp-avatar-fallback">🏪</span>
              )}
            </div>
            <div className="sp-store-info">
              <h1 className="sp-store-name">{seller.nama_toko}</h1>
              <div className="sp-store-meta">
                <span className="sp-meta-item">
                  <MapPin size={14} /> {seller.kota || seller.alamat || 'Indonesia'}
                </span>
                <span className="sp-meta-dot">•</span>
                <span className="sp-meta-item">
                  <CalendarDays size={14} /> Bergabung {joinDate}
                </span>
              </div>
              <div className="sp-store-status">
                <span className={`sp-status-badge ${seller.is_open ? 'open' : 'closed'}`}>
                  {seller.is_open ? '● Buka' : '● Tutup'}
                </span>
              </div>
            </div>
          </div>
          <div className="sp-header-right">
            <button className="sp-btn sp-btn-chat">
              <MessageCircle size={16} /> Chat Penjual
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="sp-stats-bar">
          <div className="sp-stat">
            <Package size={18} />
            <div>
              <span className="sp-stat-value">{totalProducts}</span>
              <span className="sp-stat-label">Produk</span>
            </div>
          </div>
          <div className="sp-stat-divider"></div>
          <div className="sp-stat">
            <Star size={18} />
            <div>
              <span className="sp-stat-value">{avgRating}</span>
              <span className="sp-stat-label">Rating</span>
            </div>
          </div>
          <div className="sp-stat-divider"></div>
          <div className="sp-stat">
            <Package size={18} />
            <div>
              <span className="sp-stat-value">{seller.pesanan_selesai || 0}</span>
              <span className="sp-stat-label">Terjual</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="sp-toolbar">
        <div className="sp-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Cari produk di toko ini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="sp-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Harga Termurah</option>
          <option value="termahal">Harga Termahal</option>
          <option value="terlaris">Terlaris</option>
        </select>
      </div>

      {/* ===== CATEGORY TABS ===== */}
      <div className="sp-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`sp-tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      {filteredProducts.length > 0 ? (
        <div className="sp-products-grid">
          {filteredProducts.map((item) => (
            <div className="sp-product-item" key={item.id_product}>
              <Link
                to={`/product/${item.id_product}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card product={item} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="sp-empty">
          <Package size={48} strokeWidth={1} />
          <p>
            {searchQuery
              ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
              : 'Belum ada produk di kategori ini.'}
          </p>
        </div>
      )}
    </div>
  );
}
