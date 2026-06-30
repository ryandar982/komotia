import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { Users, Plus, Trash2, Eye, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import './KelolaKolektif.css';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export default function KelolaKolektif({ sellerId }) {
  const [campaigns, setCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingParticipants, setViewingParticipants] = useState(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [hargaKolektif, setHargaKolektif] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Fetch campaigns milik seller ini
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collective_purchases')
        .select(`
          *,
          products (
            id_product,
            nama_product,
            harga,
            gambar_utama,
            stok,
            satuan
          ),
          collective_participants (
            id,
            id_user,
            quantity,
            joined_at,
            status
          )
        `)
        .eq('products.id_seller', parseInt(sellerId))
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter: hanya kampanye yang punya produk milik seller ini
      const filtered = (data || []).filter(c => c.products !== null);
      setCampaigns(filtered);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products milik seller untuk dropdown
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id_product, nama_product, harga, stok, gambar_utama')
        .eq('id_seller', parseInt(sellerId))
        .order('nama_product');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchCampaigns();
      fetchProducts();
    }
  }, [sellerId]);

  // Handle form submit - buat kampanye baru
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedProduct) return setFormError('Pilih produk terlebih dahulu.');
    if (!hargaKolektif || parseFloat(hargaKolektif) <= 0) return setFormError('Harga kolektif harus lebih dari 0.');
    if (!target || parseInt(target) < 2) return setFormError('Target minimal 2 peserta.');
    if (!deadline) return setFormError('Batas waktu wajib diisi.');

    const product = products.find(p => p.id_product === parseInt(selectedProduct));
    if (product && parseFloat(hargaKolektif) >= product.harga) {
      return setFormError('Harga kolektif harus lebih murah dari harga normal.');
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return setFormError('Batas waktu harus di masa depan.');
    }

    setFormLoading(true);

    try {
      const { error } = await supabase
        .from('collective_purchases')
        .insert({
          id_product: parseInt(selectedProduct),
          harga_kolektif: parseFloat(hargaKolektif),
          target: parseInt(target),
          terkumpul: 0,
          status: 'active',
          deadline: deadlineDate.toISOString()
        });

      if (error) throw error;

      setFormSuccess('🎉 Kampanye kolektif berhasil dibuat!');
      setSelectedProduct('');
      setHargaKolektif('');
      setTarget('');
      setDeadline('');
      
      // Refetch
      await fetchCampaigns();

      // Auto close form after success
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess('');
      }, 2000);
    } catch (err) {
      setFormError('Gagal membuat kampanye: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle cancel/delete campaign
  const handleCancelCampaign = async (campaignId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan kampanye kolektif ini?')) return;

    try {
      const { error } = await supabase
        .from('collective_purchases')
        .update({ status: 'cancelled' })
        .eq('id', campaignId);

      if (error) throw error;
      await fetchCampaigns();
    } catch (err) {
      alert('Gagal membatalkan kampanye: ' + err.message);
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const map = {
      active: { label: 'Aktif', className: 'kk-badge-active', icon: <Clock size={12} /> },
      fulfilled: { label: 'Tercapai', className: 'kk-badge-fulfilled', icon: <CheckCircle size={12} /> },
      expired: { label: 'Kadaluarsa', className: 'kk-badge-expired', icon: <XCircle size={12} /> },
      cancelled: { label: 'Dibatalkan', className: 'kk-badge-cancelled', icon: <XCircle size={12} /> }
    };
    const info = map[status] || map.active;
    return (
      <span className={`kk-status-badge ${info.className}`}>
        {info.icon} {info.label}
      </span>
    );
  };

  // Get discount %
  const getDiscount = (normalPrice, kolektifPrice) => {
    if (!normalPrice || normalPrice <= 0) return 0;
    return Math.round(((normalPrice - kolektifPrice) / normalPrice) * 100);
  };

  // Auto-fill harga suggestion
  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id_product === parseInt(productId));
    if (product) {
      // Suggest 15% discount
      const suggested = Math.round(product.harga * 0.85);
      setHargaKolektif(suggested.toString());
    }
  };

  // Time remaining
  const getTimeText = (deadline) => {
    if (!deadline) return '';
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return 'Sudah lewat';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}h ${hours}j lagi`;
    return `${hours}j lagi`;
  };

  if (loading) {
    return (
      <div className="kk-container">
        <div className="kk-loading">
          <Loader2 size={28} className="kk-spin" />
          <p>Memuat kampanye kolektif...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kk-container">
      <div className="kk-header">
        <div>
          <h2><Users size={24} /> Kelola Pembelian Kolektif</h2>
          <p className="kk-subtitle">Buat dan kelola kampanye pembelian kolektif untuk produk Anda</p>
        </div>
        <button
          className="kk-btn-create"
          onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }}
        >
          <Plus size={18} />
          {showForm ? 'Tutup Form' : 'Buat Kampanye Baru'}
        </button>
      </div>

      {/* Form Buat Kampanye */}
      {showForm && (
        <div className="kk-form-card">
          <h3>Buat Kampanye Kolektif Baru</h3>

          {formError && (
            <div className="kk-alert kk-alert-error">⚠️ {formError}</div>
          )}
          {formSuccess && (
            <div className="kk-alert kk-alert-success">✅ {formSuccess}</div>
          )}

          <form onSubmit={handleCreateCampaign}>
            {/* Pilih Produk */}
            <div className="kk-form-group">
              <label>Pilih Produk</label>
              <select
                className="kk-input"
                value={selectedProduct}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="">-- Pilih Produk --</option>
                {products.map(p => (
                  <option key={p.id_product} value={p.id_product}>
                    {p.nama_product} — {formatRupiah(p.harga)} (Stok: {p.stok})
                  </option>
                ))}
              </select>
            </div>

            {/* Harga Kolektif */}
            <div className="kk-form-row">
              <div className="kk-form-group">
                <label>Harga Kolektif (Rp)</label>
                <input
                  type="number"
                  className="kk-input"
                  placeholder="Harga diskon untuk kolektif"
                  value={hargaKolektif}
                  onChange={(e) => setHargaKolektif(e.target.value)}
                  min="0"
                />
                {selectedProduct && hargaKolektif && (
                  <span className="kk-form-hint">
                    Diskon {getDiscount(
                      products.find(p => p.id_product === parseInt(selectedProduct))?.harga,
                      parseFloat(hargaKolektif)
                    )}% dari harga normal
                  </span>
                )}
              </div>

              <div className="kk-form-group">
                <label>Target Peserta</label>
                <input
                  type="number"
                  className="kk-input"
                  placeholder="Min. 2"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  min="2"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="kk-form-group">
              <label>Batas Waktu</label>
              <input
                type="datetime-local"
                className="kk-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="kk-btn-submit"
              disabled={formLoading}
            >
              {formLoading ? 'Membuat...' : '🚀 Buat Kampanye Kolektif'}
            </button>
          </form>
        </div>
      )}

      {/* Daftar Kampanye */}
      {campaigns.length === 0 ? (
        <div className="kk-empty">
          <Users size={48} />
          <h3>Belum Ada Kampanye</h3>
          <p>Buat kampanye pembelian kolektif pertama Anda untuk menarik lebih banyak pembeli!</p>
        </div>
      ) : (
        <div className="kk-campaign-list">
          {campaigns.map(campaign => {
            const product = campaign.products;
            const progress = campaign.target > 0 ? (campaign.terkumpul / campaign.target) * 100 : 0;
            const participants = campaign.collective_participants || [];

            return (
              <div key={campaign.id} className="kk-campaign-card">
                <div className="kk-campaign-top">
                  <img
                    src={product?.gambar_utama || '/asset/images/item/item1.jpg'}
                    alt={product?.nama_product}
                    className="kk-campaign-img"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/asset/images/item/item1.jpg'; }}
                  />
                  <div className="kk-campaign-info">
                    <div className="kk-campaign-name-row">
                      <h4>{product?.nama_product}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="kk-campaign-prices">
                      <span className="kk-price-normal">{formatRupiah(product?.harga || 0)}</span>
                      <span className="kk-price-kolektif">{formatRupiah(campaign.harga_kolektif)}</span>
                      <span className="kk-discount-tag">
                        -{getDiscount(product?.harga, campaign.harga_kolektif)}%
                      </span>
                    </div>
                    <div className="kk-campaign-meta">
                      <span><Users size={14} /> {participants.length} peserta</span>
                      <span><Clock size={14} /> {getTimeText(campaign.deadline)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="kk-campaign-progress">
                  <div className="kk-progress-info">
                    <span>Terkumpul: {campaign.terkumpul}/{campaign.target}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="kk-progress-bar">
                    <div className="kk-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="kk-campaign-actions">
                  <button
                    className="kk-btn-view"
                    onClick={() => setViewingParticipants(
                      viewingParticipants === campaign.id ? null : campaign.id
                    )}
                  >
                    <Eye size={14} />
                    {viewingParticipants === campaign.id ? 'Sembunyikan' : 'Lihat Peserta'}
                  </button>
                  {campaign.status === 'active' && (
                    <button
                      className="kk-btn-cancel"
                      onClick={() => handleCancelCampaign(campaign.id)}
                    >
                      <Trash2 size={14} />
                      Batalkan
                    </button>
                  )}
                </div>

                {/* Participant List */}
                {viewingParticipants === campaign.id && (
                  <div className="kk-participants">
                    {participants.length === 0 ? (
                      <p className="kk-no-participants">Belum ada peserta.</p>
                    ) : (
                      <table className="kk-participants-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>ID User</th>
                            <th>Jumlah</th>
                            <th>Bergabung</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p, idx) => (
                            <tr key={p.id}>
                              <td>{idx + 1}</td>
                              <td>{p.id_user}</td>
                              <td>{p.quantity}</td>
                              <td>{new Date(p.joined_at).toLocaleDateString('id-ID')}</td>
                              <td>
                                <span className={`kk-participant-status ${p.status}`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
