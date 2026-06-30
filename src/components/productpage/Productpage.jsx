import './Productpage.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import CheckoutModal from '../checkout/CheckoutModal';

export default function Productpage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id_product', id)
                    .single();

                if (error) throw error;
                setProduct(data);

                // Fetch data seller berdasarkan id_seller produk
                if (data && data.id_seller) {
                    const { data: sellerData, error: sellerError } = await supabase
                        .from('sellers')
                        .select('id_seller, nama_toko, nama_pemilik, avatar_url, kota')
                        .eq('id_seller', data.id_seller)
                        .single();

                    if (!sellerError && sellerData) {
                        setSeller(sellerData);
                    }
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        if (product && quantity < product.stok) {
            setQuantity(quantity + 1);
        }
    };

    const handleBuyNow = () => {
        const savedUserStr = localStorage.getItem('user');
        if (!savedUserStr) {
            alert("Silakan login terlebih dahulu untuk melakukan pembelian.");
            navigate('/login');
            return;
        }
        setShowCheckout(true);
    };

    const handleCheckoutSuccess = (transaction) => {
        // Transaction saved to localStorage by CheckoutModal
        console.log('Transaction successful:', transaction);
    };

    const handleAddToCart = () => {
        const savedUserStr = localStorage.getItem('user');
        
        if (!savedUserStr) {
            alert("Silakan login terlebih dahulu untuk menambahkan ke keranjang.");
            navigate('/login');
            return;
        }

        const userData = JSON.parse(savedUserStr);

        if (!userData.dashboardData) {
            userData.dashboardData = { shoppingCart: { stores: [], summary: {} } };
        }
        
        if (!userData.dashboardData.shoppingCart) {
            userData.dashboardData.shoppingCart = { stores: [], summary: {} };
        }

        const cart = userData.dashboardData.shoppingCart;
        
        const currentStoreName = seller?.nama_toko || product.asal_kota || 'Mitra Tani Komotia';
        const storeId = currentStoreName.toLowerCase().replace(/\s+/g, '-');

        let storeIndex = cart.stores.findIndex(s => s.storeId === storeId);

        const hargaFinal = product.harga || product.price || 0;

        const newItem = {
            cartItemId: "cart-" + Date.now(),
            productId: product.id_product.toString(),
            productName: product.nama_product,
            imageUrl: product.gambar_utama || '',
            originalPrice: hargaFinal,
            discountPercentage: 0,
            finalPrice: hargaFinal,
            selectedCourier: product.is_gratis_ongkir ? "Gratis Ongkir" : "JNE Reguler",
            quantity: quantity,
            stockAvailable: product.stok || 99, 
            notesToSeller: "",
            isSelected: true,
            id_seller: product.id_seller || null,
            category: product.category || ''
        };

        if (storeIndex >= 0) {
            const existingProductIndex = cart.stores[storeIndex].products.findIndex(p => p.productId === newItem.productId);
            
            if (existingProductIndex >= 0) {
                cart.stores[storeIndex].products[existingProductIndex].quantity += quantity;
            } else {
                cart.stores[storeIndex].products.push(newItem);
            }
        } else {
            cart.stores.push({
                storeId: storeId,
                storeName: currentStoreName,
                isSelected: true,
                products: [newItem]
            });
        }

        let totalQty = 0;
        let totalOriginalPrice = 0;
        let grandTotal = 0;

        cart.stores.forEach(store => {
            store.products.forEach(item => {
                if (item.isSelected) {
                    totalQty += item.quantity;
                    totalOriginalPrice += (item.originalPrice * item.quantity);
                    grandTotal += (item.finalPrice * item.quantity);
                }
            });
        });

        cart.summary = {
            totalSelectedQuantity: totalQty,
            totalItemsOriginalPrice: totalOriginalPrice,
            totalDiscount: totalOriginalPrice - grandTotal,
            grandTotal: grandTotal
        };

        localStorage.setItem('user', JSON.stringify(userData));
        
        alert("Produk berhasil ditambahkan ke keranjang!");
    };

    // Loading state
    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <p className="text-muted">Memuat detail produk...</p>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Produk tidak ditemukan! 🌱</h2>
            </div>
        );
    }

    // Kumpulkan gambar yang tersedia
    const gambarList = [
        product.gambar_utama,
        product.gambar_2,
        product.gambar_3
    ].filter(Boolean); // Buang yang null/undefined/kosong

    // Fungsi default gambar jika tidak ada / gagal load
    const defaultImg = '/asset/images/item/item1.jpg';

    const hargaProduk = product.harga || product.price || 0;
    const hasReview = product.rating && product.rating !== "0" && Number(product.rating) > 0;
    const ratingText = hasReview 
        ? `${product.rating} (${product.jumlah_ulasan || 0} ulasan)` 
        : "Belum ada ulasan";

    return (
        <div className="product-container">
            <div className="product-main">
                
                <div className="image-gallery">
                    {/* Gambar utama */}
                    <div className="main-image-placeholder" style={{ padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img 
                            src={gambarList[selectedImage] || gambarList[0] || defaultImg} 
                            alt={product.nama_product} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }}
                        />
                    </div>
                    {/* Thumbnail gambar jika ada lebih dari 1 */}
                    {gambarList.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            {gambarList.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={img}
                                    alt={`Gambar ${idx + 1}`}
                                    onClick={() => setSelectedImage(idx)}
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImg; }}
                                    style={{ 
                                        width: '60px', height: '60px', objectFit: 'cover', 
                                        borderRadius: '8px', cursor: 'pointer',
                                        border: selectedImage === idx ? '2px solid rgba(75, 83, 32, 1)' : '2px solid #ddd'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-details">
                    <h1 className="product-title">{product.nama_product}</h1>
                    
                    <div className="product-stats">
                        {hasReview && <span className="stars">★</span>}
                        <span className="rating-score">{ratingText}</span>
                    </div>

                    <div className="product-price">
                        <span className="current-price">Rp {Number(hargaProduk).toLocaleString('id-ID')}</span>
                        {product.satuan && (
                            <span style={{ fontSize: '14px', color: '#888', marginLeft: '5px' }}>/ {product.satuan}</span>
                        )}
                    </div>

                    {/* Deskripsi produk */}
                    {product.deskripsi && (
                        <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                            <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{product.deskripsi}</p>
                        </div>
                    )}

                    <div className="delivery-info">
                        <div className="info-row">
                            <span className="icon">🚚</span>
                            <div>
                                <strong>{product.is_gratis_ongkir ? 'Gratis Ongkir' : 'Ongkir Reguler'}</strong>
                                {product.asal_kota && <p>Dikirim dari {product.asal_kota}</p>}
                            </div>
                        </div>  
                    </div>

                    <div className="quantity-section">
                        <span className="qty-label">Jumlah:</span>
                        <div className="qty-controls">
                            <button onClick={handleDecrease}>−</button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={handleIncrease}>+</button>
                        </div>
                        <span className="stock-info">
                            Stok: {product.stok !== null && product.stok !== undefined ? `${product.stok} ${product.satuan || 'Barang'}` : 'Tersedia'}
                        </span>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={handleBuyNow}>Beli Sekarang</button>
                        <button className="btn btn-secondary" onClick={handleAddToCart}>Tambahkan Ke Keranjang</button>
                    </div>
                </div>
            </div>

            <div className="seller-info">
                <div className="seller-profile">
                    <div className="seller-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {seller?.avatar_url ? (
                            <img 
                                src={seller.avatar_url} 
                                alt={seller.nama_toko} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.textContent = '🏪'; }}
                            />
                        ) : (
                            <span style={{ fontSize: '20px' }}>🏪</span>
                        )}
                    </div>
                    <div className="seller-details">
                        <h3>{seller?.nama_toko || 'Toko Komotia'}</h3>
                        <p>{seller?.kota || product.asal_kota || 'Indonesia'}</p>
                    </div>
                </div>
                <Link to={`/store/${seller?.id_seller || product.id_seller}`} className="btn btn-primary btn-chat" style={{ textDecoration: 'none', textAlign: 'center' }}>Kunjungi Toko</Link>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                items={[{
                    productId: product.id_product,
                    productName: product.nama_product,
                    imageUrl: product.gambar_utama || '',
                    finalPrice: hargaProduk,
                    quantity: quantity,
                    isGratisOngkir: product.is_gratis_ongkir || false,
                    storeName: seller?.nama_toko || product.asal_kota || 'Toko Komotia',
                    id_seller: product.id_seller,
                    category: product.category || '',
                }]}
                onSuccess={handleCheckoutSuccess}
            />
        </div>
    );
}