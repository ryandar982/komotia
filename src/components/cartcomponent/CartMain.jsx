import React, { useState, useEffect } from 'react';
import './CartMain.css';
import { 
  MapPin, 
  Store, 
  Trash2, 
  Heart, 
  Minus, 
  Plus, 
  Truck 
} from 'lucide-react';

export default function CartMain({ data }) {
  const [cartData, setCartData] = useState(data);

  useEffect(() => {
    if (data) {
      setCartData(data);
    } else {
      const savedUserData = localStorage.getItem('user');
      if (savedUserData) {
        const parsedUser = JSON.parse(savedUserData);
        if (parsedUser.dashboardData && parsedUser.dashboardData.shoppingCart) {
          setCartData(parsedUser.dashboardData.shoppingCart);
        }
      }
    }
  }, [data]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleDelete = (storeId, cartItemId) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus produk ini dari keranjang?");
    
    if (!isConfirmed) return;

    let updatedCart = { ...cartData };

    const storeIndex = updatedCart.stores.findIndex(s => s.storeId === storeId);
    
    if (storeIndex > -1) {
      updatedCart.stores[storeIndex].products = updatedCart.stores[storeIndex].products.filter(
        p => p.cartItemId !== cartItemId
      );

      if (updatedCart.stores[storeIndex].products.length === 0) {
        updatedCart.stores.splice(storeIndex, 1);
      }

      let totalQty = 0;
      let totalOriginalPrice = 0;
      let grandTotal = 0;

      updatedCart.stores.forEach(store => {
        store.products.forEach(item => {
          if (item.isSelected) {
            totalQty += item.quantity;
            totalOriginalPrice += (item.originalPrice * item.quantity);
            grandTotal += (item.finalPrice * item.quantity);
          }
        });
      });

      updatedCart.summary = {
        totalSelectedQuantity: totalQty,
        totalItemsOriginalPrice: totalOriginalPrice,
        totalDiscount: totalOriginalPrice - grandTotal,
        grandTotal: grandTotal
      };

      setCartData(updatedCart);

      const savedUserData = localStorage.getItem('user');
      if (savedUserData) {
        const parsedUser = JSON.parse(savedUserData);
        if (parsedUser.dashboardData) {
          parsedUser.dashboardData.shoppingCart = updatedCart;
          localStorage.setItem('user', JSON.stringify(parsedUser));
          window.dispatchEvent(new Event('cartUpdated'));
        }
      }
    }
  };

  const handleQuantityChange = (storeId, cartItemId, delta) => {
    let updatedCart = { ...cartData };

    const storeIndex = updatedCart.stores.findIndex(s => s.storeId === storeId);
    if (storeIndex > -1) {
      const productIndex = updatedCart.stores[storeIndex].products.findIndex(p => p.cartItemId === cartItemId);
      if (productIndex > -1) {
        let newQty = updatedCart.stores[storeIndex].products[productIndex].quantity + delta;
        
        if (newQty < 1) newQty = 1;
        
        updatedCart.stores[storeIndex].products[productIndex].quantity = newQty;

        let totalQty = 0;
        let totalOriginalPrice = 0;
        let grandTotal = 0;

        updatedCart.stores.forEach(store => {
          store.products.forEach(item => {
            if (item.isSelected) {
              totalQty += item.quantity;
              totalOriginalPrice += (item.originalPrice * item.quantity);
              grandTotal += (item.finalPrice * item.quantity);
            }
          });
        });

        updatedCart.summary = {
          totalSelectedQuantity: totalQty,
          totalItemsOriginalPrice: totalOriginalPrice,
          totalDiscount: totalOriginalPrice - grandTotal,
          grandTotal: grandTotal
        };

        setCartData(updatedCart);

        const savedUserData = localStorage.getItem('user');
        if (savedUserData) {
          const parsedUser = JSON.parse(savedUserData);
          if (parsedUser.dashboardData) {
            parsedUser.dashboardData.shoppingCart = updatedCart;
            localStorage.setItem('user', JSON.stringify(parsedUser));
            window.dispatchEvent(new Event('cartUpdated'));
          }
        }
      }
    }
  };

  if (!cartData || !cartData.stores || cartData.stores.length === 0) {
    return (
      <div className='cart-container' style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h2>Keranjang Belanja Kosong</h2>
        <p>Produk yang Anda tambahkan akan muncul di sini.</p>
      </div>
    );
  }

  const { selectedAddress, stores, summary } = cartData;

  return (
    <div className='cart-container' style={{ paddingTop: data ? '0' : '100px' }}>
      <h2 className='cart-page-title'>Troli Belanja</h2>

      <div className='cart-layout'>
        <div className='cart-main-content'>
          <div className='cart-section address-section'>
            <div className='address-header'>
              <MapPin size={20} className='icon-orange' />
              <strong>Alamat Pengiriman</strong>
            </div>
            <div className='address-body'>
              <p><strong>{selectedAddress?.recipientName}</strong> {selectedAddress?.phone}</p>
              <p>{selectedAddress?.fullAddress}</p>
            </div>
            <button className='btn-ubah-alamat'>Ubah Alamat</button>
          </div>

          {stores.map((store) => (
            <div key={store.storeId} className='cart-section cart-item-card'>
              <div className='item-store-header'>
                <input type='checkbox' defaultChecked={store.isSelected} />
                <Store size={18} />
                <strong>{store.storeName}</strong>
              </div>

              {store.products.map((item) => (
                <React.Fragment key={item.cartItemId}>
                  <div className='item-product-detail'>
                    <input type='checkbox' className='item-checkbox' defaultChecked={item.isSelected} />
                    <img src={item.imageUrl} alt={item.productName} className='item-image' />
                    <div className='item-info'>
                      <h3>{item.productName}</h3>
                      <div className='item-price-row'>
                        <span className='price-final'>{formatRupiah(item.finalPrice)}</span>
                      </div>
                    </div>
                    <div className='item-shipping-info'>
                      <div className='shipping-badge'>
                        <Truck size={14} />
                        {item.selectedCourier}
                      </div>
                    </div>
                  </div>

                  <div className='item-order-info'>
                    <div className='item-action-row'>
                      <div className='note-input-container'>
                        <input type='text' placeholder='Catatan...' className='note-input' defaultValue={item.notesToSeller} />
                      </div>
                      <div className='action-controls'>
                        <button 
                          className='icon-btn' 
                          onClick={() => handleDelete(store.storeId, item.cartItemId)}
                        >
                          <Trash2 size={20} />
                        </button>
                        
                        <div className='qty-control'>
                          <button 
                            className='qty-btn'
                            onClick={() => handleQuantityChange(store.storeId, item.cartItemId, -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <input type='text' value={item.quantity} readOnly className='qty-input' />
                          <button 
                            className='qty-btn'
                            onClick={() => handleQuantityChange(store.storeId, item.cartItemId, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className='cart-sidebar'>
          <div className='summary-card'>
            <h3>Ringkasan Belanja</h3>
            <div className='summary-row'>
              <span>Total Harga ({summary?.totalSelectedQuantity || 0} Produk)</span>
              <span>{formatRupiah(summary?.totalItemsOriginalPrice || 0)}</span>
            </div>
            <div className='summary-row total'>
              <span>Total Pembelian</span>
              <span className='total-price'>{formatRupiah(summary?.grandTotal || 0)}</span>
            </div>
            <button className='btn-beli'>Beli ({summary?.totalSelectedQuantity || 0})</button>
          </div>
        </div>
      </div>
    </div>
  );
}