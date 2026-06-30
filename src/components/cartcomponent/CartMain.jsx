import React, { useState, useEffect } from 'react';
import './CartMain.css';
import CheckoutModal from '../checkout/CheckoutModal';
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
  const [showCheckout, setShowCheckout] = useState(false);

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
      <div className='cart-container' style={{ paddingTop: data ? '0' : '100px' }}>
        <h2 className='cart-page-title'>Troli Belanja</h2>
        <div className='cart-empty-state'>
          <div className='cart-empty-icon-wrapper'>
            <img 
              src='/asset/images/keranjang-kosong.png' 
              alt='Keranjang Kosong' 
              className='cart-empty-icon'
            />
          </div>
          <h3 className='cart-empty-title'>Keranjang Belanjamu Masih Kosong</h3>
          <p className='cart-empty-desc'>
            Yuk, mulai belanja dan temukan produk pertanian terbaik untuk kebutuhanmu!
          </p>
          <a href='/' className='cart-empty-btn'>
            <Store size={18} />
            Mulai Belanja
          </a>
        </div>
      </div>
    );
  }

  // Collect selected items for checkout
  const getSelectedItems = () => {
    const items = [];
    if (cartData && cartData.stores) {
      cartData.stores.forEach(store => {
        store.products.forEach(item => {
          if (item.isSelected) {
            items.push({
              productId: item.productId,
              productName: item.productName,
              imageUrl: item.imageUrl,
              finalPrice: item.finalPrice,
              quantity: item.quantity,
              isGratisOngkir: item.selectedCourier === 'Gratis Ongkir',
              storeName: store.storeName,
              cartItemId: item.cartItemId,
              storeId: store.storeId,
              id_seller: item.id_seller,
              category: item.category,
            });
          }
        });
      });
    }
    return items;
  };

  const handleBuyClick = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      alert('Pilih minimal satu produk untuk dibeli.');
      return;
    }

    const savedUserStr = localStorage.getItem('user');
    if (!savedUserStr) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (transaction) => {
    // Remove purchased items from cart
    let updatedCart = { ...cartData };

    transaction.items.forEach(txItem => {
      updatedCart.stores.forEach((store, sIdx) => {
        updatedCart.stores[sIdx].products = store.products.filter(
          p => !(p.productName === txItem.productName && p.isSelected)
        );
      });
    });

    // Remove empty stores
    updatedCart.stores = updatedCart.stores.filter(s => s.products.length > 0);

    // Recalculate summary
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
      grandTotal: grandTotal,
    };

    setCartData(updatedCart);

    // Update localStorage
    const savedUserData = localStorage.getItem('user');
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData);
      if (parsedUser.dashboardData) {
        parsedUser.dashboardData.shoppingCart = updatedCart;
        localStorage.setItem('user', JSON.stringify(parsedUser));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  };

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
            <button className='btn-beli' onClick={handleBuyClick}>Beli ({summary?.totalSelectedQuantity || 0})</button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={getSelectedItems()}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}