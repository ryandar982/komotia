import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Minus, Plus, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import './KolektifModal.css';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

/**
 * KolektifModal - Modal konfirmasi untuk bergabung di pembelian kolektif
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.campaign - Data kampanye kolektif
 * @param {Function} props.onJoin - Handler saat user konfirmasi gabung (quantity) => Promise
 * @param {boolean} props.isAlreadyJoined
 */
export default function KolektifModal({ isOpen, onClose, campaign, onJoin, isAlreadyJoined }) {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState('form'); // 'form' | 'processing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [isFulfilled, setIsFulfilled] = useState(false);

  // Reset state saat modal buka
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setStep('form');
      setErrorMsg('');
      setIsFulfilled(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !campaign) return null;

  const product = campaign.products;
  const seller = product?.sellers;
  const remaining = campaign.target - campaign.terkumpul;
  const maxQty = Math.min(remaining, product?.stok || remaining);
  const discountPercent = product?.harga
    ? Math.round(((product.harga - campaign.harga_kolektif) / product.harga) * 100)
    : 0;
  const totalPrice = campaign.harga_kolektif * quantity;
  const progress = (campaign.terkumpul / campaign.target) * 100;
  const participantCount = campaign.collective_participants?.length || 0;

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxQty) return maxQty;
      return next;
    });
  };

  const handleJoin = async () => {
    if (isAlreadyJoined) return;
    setStep('processing');

    try {
      const result = await onJoin(quantity);
      if (result.success) {
        setIsFulfilled(result.fulfilled || false);
        setStep('success');
      } else {
        setErrorMsg(result.error || 'Gagal bergabung.');
        setStep('error');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan.');
      setStep('error');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && step === 'form') {
      onClose();
    }
  };

  // Countdown
  const getTimeRemaining = () => {
    if (!campaign.deadline) return null;
    const now = new Date();
    const deadline = new Date(campaign.deadline);
    const diff = deadline - now;
    if (diff <= 0) return { expired: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes, expired: false };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="kolektif-modal-overlay" onClick={handleOverlayClick}>
      <div className="kolektif-modal">

        {/* HEADER */}
        <div className="kolektif-modal-header">
          <h2>
            {step === 'form' && <><Users size={22} /> Gabung Kolektif</>}
            {step === 'processing' && <>Memproses...</>}
            {step === 'success' && <><CheckCircle size={22} /> Berhasil!</>}
            {step === 'error' && <><AlertTriangle size={22} /> Gagal</>}
          </h2>
          {(step === 'form' || step === 'error') && (
            <button className="kolektif-modal-close" onClick={onClose}><X size={20} /></button>
          )}
        </div>

        {/* FORM STEP */}
        {step === 'form' && (
          <div className="kolektif-modal-body">

            {/* Product Info */}
            <div className="kolektif-modal-product">
              <img
                src={product?.gambar_utama || '/asset/images/item/item1.jpg'}
                alt={product?.nama_product}
                className="kolektif-modal-img"
                onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
              />
              <div className="kolektif-modal-product-info">
                <h3>{product?.nama_product}</h3>
                {seller && (
                  <span className="kolektif-modal-seller">{seller.nama_toko} · {seller.kota}</span>
                )}
                <div className="kolektif-modal-prices">
                  <span className="modal-price-original">{formatRupiah(product?.harga || 0)}</span>
                  <span className="modal-price-kolektif">{formatRupiah(campaign.harga_kolektif)}</span>
                  {discountPercent > 0 && (
                    <span className="modal-discount-badge">-{discountPercent}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="kolektif-modal-progress-section">
              <div className="kolektif-modal-progress-header">
                <span><Users size={16} /> {participantCount} peserta bergabung</span>
                <span>{campaign.terkumpul}/{campaign.target} terkumpul</span>
              </div>
              <div className="kolektif-modal-progress-bar">
                <div
                  className="kolektif-modal-progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="kolektif-modal-remaining">
                Butuh <strong>{remaining}</strong> lagi untuk mencapai target!
              </div>
            </div>

            {/* Countdown Timer */}
            {timeRemaining && !timeRemaining.expired && (
              <div className="kolektif-modal-countdown">
                <Clock size={16} />
                <span>Sisa waktu: </span>
                <strong>
                  {timeRemaining.days > 0 && `${timeRemaining.days} hari `}
                  {timeRemaining.hours} jam {timeRemaining.minutes} menit
                </strong>
              </div>
            )}
            {timeRemaining && timeRemaining.expired && (
              <div className="kolektif-modal-countdown expired">
                <AlertTriangle size={16} />
                <span>Waktu sudah habis!</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="kolektif-modal-qty-section">
              <label>Jumlah Pesanan:</label>
              <div className="kolektif-modal-qty-control">
                <button
                  className="kolektif-qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="kolektif-qty-input"
                />
                <button
                  className="kolektif-qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQty}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="kolektif-modal-max">Maks. {maxQty} {product?.satuan || 'pcs'}</span>
            </div>

            {/* Price Summary */}
            <div className="kolektif-modal-summary">
              <div className="kolektif-summary-row">
                <span>Harga Kolektif ({quantity}x)</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <div className="kolektif-summary-row savings">
                <span>Kamu hemat</span>
                <span className="savings-amount">
                  {formatRupiah((product?.harga || 0) * quantity - totalPrice)}
                </span>
              </div>
              <div className="kolektif-summary-row total">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Info Notice */}
            <div className="kolektif-modal-notice">
              <span>ℹ️</span>
              <p>Pembayaran akan diproses setelah target peserta terpenuhi. Jika target tidak tercapai sebelum batas waktu, pesanan akan dibatalkan otomatis.</p>
            </div>

            {/* Join Button */}
            {isAlreadyJoined ? (
              <button className="kolektif-modal-join-btn already-joined" disabled>
                <CheckCircle size={18} /> Kamu Sudah Bergabung
              </button>
            ) : (
              <button
                className="kolektif-modal-join-btn"
                onClick={handleJoin}
                disabled={timeRemaining?.expired || remaining <= 0}
              >
                <ShoppingBag size={18} />
                Gabung Kolektif — {formatRupiah(totalPrice)}
              </button>
            )}
          </div>
        )}

        {/* PROCESSING STEP */}
        {step === 'processing' && (
          <div className="kolektif-modal-processing">
            <div className="kolektif-spinner" />
            <p>Sedang memproses keikutsertaan...</p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <div className="kolektif-modal-success">
            <div className="kolektif-success-icon">
              <CheckCircle size={56} />
            </div>
            <h3>Berhasil Bergabung! 🎉</h3>
            <p>Kamu telah bergabung di pembelian kolektif <strong>{product?.nama_product}</strong>.</p>
            {isFulfilled ? (
              <div className="kolektif-fulfilled-notice">
                <span>🎊</span>
                <p><strong>Target tercapai!</strong> Pembelian kolektif akan segera diproses.</p>
              </div>
            ) : (
              <p className="kolektif-success-waiting">
                Menunggu peserta lainnya. Kami akan memberitahu saat target terpenuhi.
              </p>
            )}
            <button className="kolektif-modal-success-btn" onClick={onClose}>
              Tutup
            </button>
          </div>
        )}

        {/* ERROR STEP */}
        {step === 'error' && (
          <div className="kolektif-modal-error">
            <div className="kolektif-error-icon">
              <AlertTriangle size={48} />
            </div>
            <h3>Gagal Bergabung</h3>
            <p>{errorMsg}</p>
            <button
              className="kolektif-modal-retry-btn"
              onClick={() => setStep('form')}
            >
              Coba Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
