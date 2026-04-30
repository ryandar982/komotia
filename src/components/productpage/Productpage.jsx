import './Productpage.css';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyProducts } from '../../data/dummyProducts';

export default function Productpage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const product = dummyProducts.find((item) => item.id === parseInt(id));

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
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
        
        const currentStoreName = product.seller || 'Mitra Tani Komotia';
        const storeId = currentStoreName.toLowerCase().replace(/\s+/g, '-');

        let storeIndex = cart.stores.findIndex(s => s.storeId === storeId);

        const nameParts = product.name.split(' | ');
        const productName = nameParts[0];

        const newItem = {
            cartItemId: "cart-" + Date.now(),
            productId: product.id.toString(),
            productName: productName,
            imageUrl: product.image,
            originalPrice: product.price,
            discountPercentage: 0,
            finalPrice: product.price,
            selectedCourier: "Gratis Ongkir",
            quantity: quantity,
            stockAvailable: 99, 
            notesToSeller: "",
            isSelected: true
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

    if (!product) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Produk tidak ditemukan! 🌱</h2>
            </div>
        );
    }

    const nameParts = product.name.split(' | ');
    const productName = nameParts[0];

    const hasReview = product.ratingText !== "Tidak ada ulasan";

    return (
        <div className="product-container">
            <div className="product-main">
                
                <div className="image-gallery">
                    <div className="main-image-placeholder" style={{ padding: 0, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img 
                            src={product.image.startsWith('http') ? product.image : `${product.image}`} 
                            alt={productName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
                        />
                    </div>
                </div>

                <div className="product-details">
                    <h1 className="product-title">{productName}</h1>
                    
                    <div className="product-stats">
                        {hasReview && <span className="stars">★</span>}
                        <span className="rating-score">{product.ratingText}</span>
                    </div>

                    <div className="product-price">
                        <span className="current-price">Rp {product.price.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="delivery-info">
                        <div className="info-row">
                            <span className="icon">🚚</span>
                            <div>
                                <strong>Gratis Ongkir</strong>
                                <p>Untuk Seluruh Indonesia</p>
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
                        <span className="stock-info">Tersedia</span>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-primary">Beli Sekarang</button>
                        <button className="btn btn-secondary" onClick={handleAddToCart}>Tambahkan Ke Keranjang</button>
                    </div>
                </div>
            </div>

            <div className="seller-info">
                <div className="seller-profile">
                    <div className="seller-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0e0e0', fontSize: '20px' }}>
                        🏪
                    </div>
                    <div className="seller-details">
                        <h3>{product.seller}</h3>
                        <p>Aktif Membalas Pesan</p>
                    </div>
                </div>
                <button className="btn btn-primary btn-chat">Chat Seller</button>
            </div>
        </div>
    );
}