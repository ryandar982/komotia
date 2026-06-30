import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import './CheckoutModal.css';

const LOGO_PATH = '/asset/images/logologo/';

const PAYMENT_METHODS = [
  { id: 'bca', name: 'BCA', logo: LOGO_PATH + 'BCA.png', desc: 'Virtual Account' },
  { id: 'mandiri', name: 'Mandiri', logo: LOGO_PATH + 'Mandiri.png', desc: 'Virtual Account' },
  { id: 'bri', name: 'BRI', logo: LOGO_PATH + 'BRI.png', desc: 'Virtual Account' },
  { id: 'gopay', name: 'GoPay', logo: LOGO_PATH + 'GOPAY.png', desc: 'E-Wallet' },
  { id: 'nobu', name: 'NOBU', logo: LOGO_PATH + 'NOBU.png', desc: 'Virtual Account' },
  { id: 'dana', name: 'DANA', logo: LOGO_PATH + 'DANA.png', desc: 'E-Wallet' },
  { id: 'shopeepay', name: 'ShopeePay', logo: LOGO_PATH + 'SPAY.png', desc: 'E-Wallet' },
  { id: 'qris', name: 'QRIS', logo: LOGO_PATH + 'QRIS.png', desc: 'Scan QR' },
  { id: 'cod', name: 'COD', icon: '💵', desc: 'Bayar di Tempat' },
];

const COURIERS = [
  { id: 'jne-reg', name: 'JNE Reguler', icon: '📦', estimate: '2-3 hari', cost: 15000 },
  { id: 'jne-yes', name: 'JNE YES', icon: '⚡', estimate: '1 hari', cost: 25000 },
  { id: 'jnt', name: 'J&T Express', logo: LOGO_PATH + 'J&T.png', estimate: '2-4 hari', cost: 12000 },
  { id: 'sicepat-reg', name: 'SiCepat REG', icon: '📫', estimate: '2-3 hari', cost: 13000 },
  { id: 'sicepat-best', name: 'SiCepat BEST', icon: '🚀', estimate: '1 hari', cost: 22000 },
  { id: 'anteraja', name: 'AnterAja', icon: '📬', estimate: '2-4 hari', cost: 11000 },
  { id: 'pos', name: 'Pos Indonesia', icon: '🏤', estimate: '3-5 hari', cost: 10000 },
  { id: 'grab', name: 'Grab Express', icon: '🟢', estimate: 'Hari ini', cost: 30000 },
  { id: 'gosend', name: 'GoSend', logo: LOGO_PATH + 'GOSEND.png', estimate: 'Hari ini', cost: 28000 },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

/**
 * CheckoutModal
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close handler
 * @param {Array} props.items - Array of items to checkout: [{ productName, imageUrl, finalPrice, quantity, isGratisOngkir }]
 * @param {Function} props.onSuccess - Called after successful transaction with order data
 */
export default function CheckoutModal({ isOpen, onClose, items = [], onSuccess }) {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success'
  const [orderId, setOrderId] = useState('');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPayment(null);
      setSelectedCourier(null);
      setStep('form');
      setOrderId('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const hasGratisOngkir = items.some(item => item.isGratisOngkir);
  const shippingCost = selectedCourier
    ? (hasGratisOngkir ? 0 : COURIERS.find(c => c.id === selectedCourier)?.cost || 0)
    : 0;
  const grandTotal = subtotal + shippingCost;

  const canProceed = selectedPayment && selectedCourier && items.length > 0;

  const handlePurchase = async () => {
    if (!canProceed) return;

    setStep('processing');

    try {
      // Dapatkan data user yang login
      const savedUserStr = localStorage.getItem('user');
      const userData = savedUserStr ? JSON.parse(savedUserStr) : null;
      const userId = userData?.id_user || null;
      const buyerUsername = userData?.username || userData?.nama || 'Guest';
      const address = userData?.alamat || 'Alamat tidak diketahui';

      const paymentMethodName = PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name || selectedPayment;
      const courierName = COURIERS.find(c => c.id === selectedCourier)?.name || selectedCourier;

      // Group items by seller
      const itemsBySeller = items.reduce((acc, item) => {
        const sellerId = item.id_seller ? item.id_seller : 'null'; // Use string 'null' as key for items without seller
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
      }, {});

      // Proses per seller
      const createdTransactions = [];

      for (const [sellerIdStr, sellerItems] of Object.entries(itemsBySeller)) {
        const sellerId = sellerIdStr === 'null' ? null : parseInt(sellerIdStr);
        const newOrderId = 'KMT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // Calculate totals for this seller
        const sellerSubtotal = sellerItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        const sellerHasGratisOngkir = sellerItems.some(item => item.isGratisOngkir);
        const sellerShippingCost = selectedCourier ? (sellerHasGratisOngkir ? 0 : COURIERS.find(c => c.id === selectedCourier)?.cost || 0) : 0;
        const sellerGrandTotal = sellerSubtotal + sellerShippingCost;

        // 1. Insert into transactions (untuk User Dashboard v_order_history)
        const { data: trxData, error: trxError } = await supabase
          .from('transactions')
          .insert({
            id_user: userId,
            id_seller: sellerId,
            tanggal_transaksi: new Date().toISOString(),
            total_harga: sellerGrandTotal,
            status: 'pending',
            alamat_pengiriman: address,
            metode_pembayaran: paymentMethodName,
            kurir: courierName,
            batas_bayar: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 jam
          })
          .select()
          .single();

        if (trxError) throw trxError;
        const newTrxId = trxData.id_transaction;

        // 2. Insert into transaction_details
        const trxDetailsData = sellerItems.map(item => ({
          id_transaction: newTrxId,
          id_product: item.productId ? parseInt(item.productId) : (item.id ? parseInt(item.id) : 1),
          jumlah: item.quantity,
          harga_satuan: item.finalPrice,
          subtotal: item.finalPrice * item.quantity
        }));

        const { error: trxDetailsError } = await supabase
          .from('transaction_details')
          .insert(trxDetailsData);

        if (trxDetailsError) throw trxDetailsError;

        // 3. Insert into orders (untuk Seller Dashboard)
        // Note: if id_seller is required and we have null, this might fail. 
        // We will only insert into orders if sellerId is not null.
        if (sellerId !== null) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              invoice: newOrderId,
              buyer_username: buyerUsername,
              id_user: userId,
              id_seller: sellerId,
              status: 'Perlu Diproses',
              total_amount: sellerGrandTotal
            })
            .select()
            .single();

          if (orderError) throw orderError;
          const newOrderTableId = orderData.id_order;

          // 4. Insert into order_items
          const orderItemsData = sellerItems.map(item => ({
            id_order: newOrderTableId,
            id_product: item.productId ? parseInt(item.productId) : (item.id ? parseInt(item.id) : 1),
            product_name: item.productName,
            category: item.category || 'Lainnya',
            price: item.finalPrice,
            quantity: item.quantity,
            image_url: item.imageUrl
          }));

          const { error: orderItemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

          if (orderItemsError) throw orderItemsError;
        }

        // Simpan format transaksi untuk return ke UI (seperti format sebelumnya)
        createdTransactions.push({
          id: newTrxId,
          orderId: newOrderId,
          date: new Date().toISOString(),
          status: 'Perlu Diproses',
          paymentMethod: paymentMethodName,
          courier: courierName,
          courierEstimate: COURIERS.find(c => c.id === selectedCourier)?.estimate || '',
          items: sellerItems,
          subtotal: sellerSubtotal,
          shippingCost: sellerShippingCost,
          totalAmount: sellerGrandTotal,
        });
      }

      // Update LocalStorage (untuk compatibility dengan bagian yang belum diubah ke Supabase)
      if (userData) {
        if (!userData.dashboardData) userData.dashboardData = {};
        if (!userData.dashboardData.orders) userData.dashboardData.orders = [];
        if (!userData.dashboardData.waitingPayments) userData.dashboardData.waitingPayments = [];

        createdTransactions.forEach(trx => {
          userData.dashboardData.waitingPayments.push({
            id: trx.id,
            orderId: trx.orderId,
            date: trx.date,
            status: 'Menunggu Pembayaran',
            totalAmount: trx.totalAmount,
            paymentMethod: trx.paymentMethod,
            courier: trx.courier,
          });
          userData.dashboardData.orders.push(trx);
        });

        localStorage.setItem('user', JSON.stringify(userData));
      }

      setStep('success');

      if (onSuccess) {
        // Return transaction pertama (atau bisa diubah logicnya kalau multi-seller)
        onSuccess(createdTransactions[0]);
      }

    } catch (err) {
      console.error('Checkout error:', err);
      alert('Terjadi kesalahan saat memproses checkout: ' + err.message);
      setStep('form');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && step === 'form') {
      onClose();
    }
  };

  const courierObj = COURIERS.find(c => c.id === selectedCourier);

  return (
    <div className="checkout-overlay" onClick={handleOverlayClick}>
      <div className="checkout-modal">

        {/* HEADER */}
        <div className="checkout-header">
          <h2>
            {step === 'form' && <>🛒 Checkout</>}
            {step === 'processing' && <>Memproses...</>}
            {step === 'success' && <> Berhasil!</>}
          </h2>
          {step === 'form' && (
            <button className="checkout-close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        {/* FORM STEP */}
        {step === 'form' && (
          <div className="checkout-body">

            {/* Product Summary */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span className="section-icon">📋</span>
                Ringkasan Pesanan
              </div>
              <div className="checkout-product-list">
                {items.map((item, idx) => (
                  <div className="checkout-product-item" key={idx}>
                    <img
                      className="checkout-product-img"
                      src={item.imageUrl || '/asset/images/item/item1.jpg'}
                      alt={item.productName}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
                    />
                    <div className="checkout-product-info">
                      <div className="checkout-product-name">{item.productName}</div>
                      <div className="checkout-product-qty">{item.quantity}x {formatRupiah(item.finalPrice)}</div>
                    </div>
                    <div className="checkout-product-price">
                      {formatRupiah(item.finalPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span className="section-icon">💳</span>
                Metode Pembayaran
              </div>
              <div className="checkout-option-grid">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`checkout-option-card ${selectedPayment === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    {method.logo ? (
                      <img className="checkout-option-logo" src={method.logo} alt={method.name} />
                    ) : (
                      <span className="checkout-option-icon">{method.icon}</span>
                    )}
                    <span className="checkout-option-name">{method.name}</span>
                    <span className="checkout-option-desc">{method.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier Selection */}
            <div className="checkout-section">
              <div className="checkout-section-title">
                <span className="section-icon"></span>
                Pilih Kurir
              </div>
              <div className="checkout-option-grid">
                {COURIERS.map((courier) => (
                  <div
                    key={courier.id}
                    className={`checkout-option-card ${selectedCourier === courier.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCourier(courier.id)}
                  >
                    {courier.logo ? (
                      <img className="checkout-option-logo" src={courier.logo} alt={courier.name} />
                    ) : (
                      <span className="checkout-option-icon">{courier.icon}</span>
                    )}
                    <span className="checkout-option-name">{courier.name}</span>
                    <span className="courier-estimate">{courier.estimate}</span>
                    <span className="checkout-option-desc">
                      {hasGratisOngkir ? 'GRATIS' : formatRupiah(courier.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} Produk)</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Ongkos Kirim {courierObj ? `(${courierObj.name})` : ''}</span>
                {hasGratisOngkir ? (
                  <span className="free-badge">GRATIS </span>
                ) : (
                  <span>{selectedCourier ? formatRupiah(shippingCost) : '-'}</span>
                )}
              </div>
              <div className="checkout-summary-row total">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Buy Button */}
            <button
              className="checkout-buy-btn"
              disabled={!canProceed}
              onClick={handlePurchase}
            >
              {canProceed
                ? `Bayar ${formatRupiah(grandTotal)}`
                : 'Pilih Metode Pembayaran & Kurir'}
            </button>
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === 'processing' && (
          <div className="checkout-processing">
            <div className="checkout-spinner" />
            <p>Sedang memproses transaksi Anda...</p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <div className="checkout-success">
            <div className="success-checkmark">
              <span>✓</span>
            </div>
            <h3>Transaksi Berhasil! </h3>
            <div className="success-order-id">No. Pesanan: {orderId}</div>
            <div className="success-detail">
              Pembayaran via <strong>{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</strong>
              <br />
              Dikirim dengan <strong>{courierObj?.name}</strong> (est. {courierObj?.estimate})
              <br />
              Total: <strong>{formatRupiah(grandTotal)}</strong>
            </div>
            <button
              className="checkout-success-btn"
              onClick={() => {
                onClose();
                navigate('/user-dashboard');
              }}
            >
              Lihat Pesanan Saya
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
