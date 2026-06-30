import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Kolektif.css';
import { ShoppingBag, Users, Clock, TrendingDown, Loader2 } from 'lucide-react';
import { useKolektif } from '../../hooks/useKolektif';
import KolektifModal from './KolektifModal';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export default function Kolektif() {
  const navigate = useNavigate();
  const { kolektifs, loading, error, joinKolektif, isUserJoined } = useKolektif();

  // Modal state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get current user
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Countdown timer (updates every minute)
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dl = new Date(deadline);
    const diff = dl - now;
    if (diff <= 0) return { expired: true, text: 'Waktu habis' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let text = '';
    if (days > 0) text += `${days}h `;
    text += `${hours}j ${minutes}m`;
    return { expired: false, text };
  };

  const handleGabungClick = (campaign) => {
    if (!currentUser) {
      alert('Silakan login terlebih dahulu untuk bergabung.');
      navigate('/login');
      return;
    }
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const handleJoin = async (quantity) => {
    if (!currentUser || !selectedCampaign) {
      return { success: false, error: 'Data tidak valid.' };
    }
    return await joinKolektif(selectedCampaign.id, currentUser.id_user, quantity);
  };

  // Loading state
  if (loading) {
    return (
      <section className='kolektif-container'>
        <div className='kolektif-text'>
          <img src='/asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' alt="Kolektif Icon" />
          <h2>Pembelian Kolektif</h2>
          <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
        </div>
        <div className='kolektif-loading'>
          <Loader2 size={32} className='kolektif-loading-spinner' />
          <p>Memuat kampanye kolektif...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className='kolektif-container'>
        <div className='kolektif-text'>
          <img src='/asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' alt="Kolektif Icon" />
          <h2>Pembelian Kolektif</h2>
          <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
        </div>
        <div className='kolektif-error-state'>
          <p>⚠️ Gagal memuat data. Silakan coba lagi nanti.</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (!kolektifs || kolektifs.length === 0) {
    return (
      <section className='kolektif-container'>
        <div className='kolektif-text'>
          <img src='/asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' alt="Kolektif Icon" />
          <h2>Pembelian Kolektif</h2>
          <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
        </div>
        <div className='kolektif-empty-state'>
          <p>Belum ada kampanye kolektif aktif saat ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section className='kolektif-container'>
      <div className='kolektif-text'>
        <img src='/asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' alt="Kolektif Icon" />
        <h2>Pembelian Kolektif</h2>
        <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
      </div>
      
      <div className='kolektif-content'>
        {kolektifs.map((item) => {
          const product = item.products;
          if (!product) return null;

          const seller = product.sellers;
          const progress = (item.terkumpul / item.target) * 100;
          const remaining = item.target - item.terkumpul;
          const participantCount = item.collective_participants?.length || 0;
          const discountPercent = product.harga
            ? Math.round(((product.harga - item.harga_kolektif) / product.harga) * 100)
            : 0;
          const timeRemaining = getTimeRemaining(item.deadline);
          const userJoined = currentUser ? isUserJoined(item.id, currentUser.id_user) : false;
          
          return (
            <div key={item.id} className='kolektif-card'>
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className='kolektif-discount-badge'>
                  <TrendingDown size={14} />
                  -{discountPercent}%
                </div>
              )}

              <img
                src={product.gambar_utama || '/asset/images/item/item1.jpg'}
                alt={product.nama_product}
                className='kolektif-img'
                onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
              />
              
              <div className='kolektif-info'>
                <h3>{product.nama_product}{seller ? ` | ${seller.nama_toko}` : ''}</h3>
                
                <div className='kolektif-prices'>
                  <span className='price-normal'>
                    {formatRupiah(product.harga)}
                  </span>
                  <span className='price-kolektif'>
                    {formatRupiah(item.harga_kolektif)}
                  </span>
                </div>

                {/* Countdown Timer */}
                {timeRemaining && (
                  <div className={`kolektif-countdown ${timeRemaining.expired ? 'expired' : ''}`}>
                    <Clock size={14} />
                    <span>{timeRemaining.expired ? 'Waktu habis' : `Sisa ${timeRemaining.text}`}</span>
                  </div>
                )}
                
                {/* Progress */}
                <div className='kolektif-progress-container'>
                  <div className='progress-text'>
                    <span>Terkumpul: <strong>{item.terkumpul}</strong></span>
                    <span>Target: <strong>{item.target}</strong></span>
                  </div>
                  <div className='progress-bar-bg'>
                    <div
                      className='progress-bar-fill'
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Social Proof */}
                <div className='kolektif-social-proof'>
                  <Users size={14} />
                  <span>
                    {participantCount > 0
                      ? `${participantCount} orang bergabung — butuh ${remaining} lagi`
                      : `Jadilah yang pertama bergabung!`
                    }
                  </span>
                </div>
                
                {/* Button */}
                {userJoined ? (
                  <button className='btn-gabung joined' disabled>
                    ✓ Sudah Bergabung
                  </button>
                ) : (
                  <button
                    className='btn-gabung'
                    onClick={() => handleGabungClick(item)}
                    disabled={timeRemaining?.expired || remaining <= 0}
                  >
                    <ShoppingBag size={18} />
                    Gabung Kolektif
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Konfirmasi Gabung */}
      <KolektifModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
        onJoin={handleJoin}
        isAlreadyJoined={
          selectedCampaign && currentUser
            ? isUserJoined(selectedCampaign.id, currentUser.id_user)
            : false
        }
      />
    </section>
  );
}