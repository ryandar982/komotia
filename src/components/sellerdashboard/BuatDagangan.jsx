import React, { useState, useRef } from 'react';
import './BuatDagangan.css';
import { supabase } from '../../config/supabaseClient';

export default function BuatDagangan({ sellerId, initialData, onComplete }) {
  // === STATE FORM ===
  const [namaProduct, setNamaProduct] = useState(initialData?.nama_product || '');
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [harga, setHarga] = useState(initialData?.harga || '');
  const [stok, setStok] = useState(initialData?.stok || '');
  const [satuan, setSatuan] = useState(initialData?.satuan || '');
  const [minOrder, setMinOrder] = useState('1');
  const [asalKota, setAsalKota] = useState(initialData?.asal_kota || '');
  const [isGratisOngkir, setIsGratisOngkir] = useState(initialData?.is_gratis_ongkir || false);

  // === STATE GAMBAR ===
  const [gambarUtamaFile, setGambarUtamaFile] = useState(null);
  const [gambar2File, setGambar2File] = useState(null);
  const [gambar3File, setGambar3File] = useState(null);
  const [previewUtama, setPreviewUtama] = useState(initialData?.gambar_utama || null);
  const [preview2, setPreview2] = useState(initialData?.gambar_2 || null);
  const [preview3, setPreview3] = useState(initialData?.gambar_3 || null);

  // === STATE UI ===
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // === REF untuk input file tersembunyi ===
  const inputUtamaRef = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // ==========================================
  // FUNGSI: Handle pilih gambar dari file input
  // ==========================================
  const handleImageSelect = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran maks 2MB
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar maksimal 2MB.');
      return;
    }

    // Validasi format
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Format gambar harus .JPG, .PNG, .GIF, atau .WEBP');
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
    setErrorMsg('');
  };

  // ==========================================
  // FUNGSI: Upload satu gambar ke Supabase Storage
  // ==========================================
  const uploadImage = async (file, folder) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Gagal upload gambar: ${error.message}`);
    }

    // Dapatkan public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  // ==========================================
  // FUNGSI: Hapus preview gambar
  // ==========================================
  const removeImage = (setFile, setPreview, inputRef) => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // ==========================================
  // FUNGSI: Reset seluruh form
  // ==========================================
  const resetForm = () => {
    setNamaProduct('');
    setDeskripsi('');
    setCategory('');
    setHarga('');
    setStok('');
    setSatuan('');
    setMinOrder('1');
    setAsalKota('');
    setIsGratisOngkir(false);
    removeImage(setGambarUtamaFile, setPreviewUtama, inputUtamaRef);
    removeImage(setGambar2File, setPreview2, input2Ref);
    removeImage(setGambar3File, setPreview3, input3Ref);
  };

  // ==========================================
  // FUNGSI: Submit form → INSERT ke Supabase
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validasi wajib
    if (!namaProduct.trim()) return setErrorMsg('Nama produk wajib diisi.');
    if (!category) return setErrorMsg('Kategori wajib dipilih.');
    if (!harga || parseFloat(harga) <= 0) return setErrorMsg('Harga harus lebih dari 0.');
    if (!stok || parseInt(stok) < 0) return setErrorMsg('Stok tidak boleh kosong.');
    if (!satuan.trim()) return setErrorMsg('Satuan wajib diisi (contoh: kg, buah, pack).');

    setIsLoading(true);

    try {
      // 1. Upload gambar (jika ada)
      let gambarUtamaUrl = null;
      let gambar2Url = null;
      let gambar3Url = null;

      if (gambarUtamaFile) {
        gambarUtamaUrl = await uploadImage(gambarUtamaFile, 'utama');
      }
      if (gambar2File) {
        gambar2Url = await uploadImage(gambar2File, 'extra');
      }
      if (gambar3File) {
        gambar3Url = await uploadImage(gambar3File, 'extra');
      }

      // 2. Mapping kategori ke id_category
      const categoryMap = {
        'Pupuk': 1,
        'Bibit': 2,
        'Pestisida': 3,
        'Alat-Pertanian': 4,
        'Perlengkapan': 5,
      };

      // 3. Upsert ke tabel products
      const productPayload = {
        nama_product: namaProduct.trim(),
        deskripsi: deskripsi.trim() || null,
        category: category,
        id_category: categoryMap[category] || 1,
        price: parseInt(harga) || 0,
        harga: parseFloat(harga) || 0,
        stok: parseInt(stok) || 0,
        satuan: satuan.trim(),
        gambar_utama: gambarUtamaUrl || initialData?.gambar_utama,
        gambar_2: gambar2Url || initialData?.gambar_2,
        gambar_3: gambar3Url || initialData?.gambar_3,
        id_seller: parseInt(sellerId),
        asal_kota: asalKota.trim() || null,
        is_gratis_ongkir: isGratisOngkir,
      };

      let dbError;
      if (initialData) {
        const { error: updateError } = await supabase.from('products').update(productPayload).eq('id_product', initialData.id_product);
        dbError = updateError;
      } else {
        productPayload.rating = 0;
        productPayload.jumlah_ulasan = 0;
        const { error: insertError } = await supabase.from('products').insert([productPayload]);
        dbError = insertError;
      }

      if (dbError) throw dbError;

      setSuccessMsg(initialData ? '🎉 Produk berhasil diperbarui!' : '🎉 Produk berhasil dibuat!');
      if (!initialData) resetForm();
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(`Gagal membuat produk: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bd-container">
      <h2 className="bd-title">{initialData ? 'Edit Produk' : 'Buat Produk'}</h2>

      {/* PESAN SUKSES */}
      {successMsg && (
        <div className="bd-alert" style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724' }}>
          <span className="bd-icon">✅</span>
          <p>{successMsg}</p>
        </div>
      )}

      {/* PESAN ERROR */}
      {errorMsg && (
        <div className="bd-alert" style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24' }}>
          <span className="bd-icon">⚠️</span>
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ===== TIPE PRODUK ===== */}
        <section className="bd-section">
          <h3 className="bd-section-title">Kategori Produk</h3>
          <div className="bd-form-group">
            <select
              className="bd-input bd-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Pupuk">Pupuk</option>
              <option value="Bibit">Bibit</option>
              <option value="Pestisida">Pestisida</option>
              <option value="Alat-Pertanian">Alat Pertanian</option>
              <option value="Perlengkapan">Perlengkapan</option>
            </select>
          </div>
        </section>

        {/* ===== INFORMASI PRODUK ===== */}
        <section className="bd-section">
          <h3 className="bd-section-title">Informasi Produk</h3>

          {!initialData && (
            <div className="bd-alert bd-alert-info">
              <span className="bd-icon">ℹ️</span>
              <p>Informasi dan kategori produk tidak bisa diubah setelah produk disimpan.</p>
            </div>
          )}

          <div className="bd-form-group">
            <label className="bd-label">Nama Produk</label>
            <input
              type="text"
              className="bd-input"
              placeholder="Contoh: Pupuk Organik Premium 5kg"
              value={namaProduct}
              onChange={(e) => setNamaProduct(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="bd-form-group">
            <label className="bd-label">Asal Kota</label>
            <input
              type="text"
              className="bd-input"
              placeholder="Contoh: Surabaya"
              value={asalKota}
              onChange={(e) => setAsalKota(e.target.value)}
            />
          </div>

          {/* === GAMBAR PRODUK === */}
          <div className="bd-form-group">
            <label className="bd-label">Gambar Produk</label>
            <div className="bd-image-upload-container">
              {/* Gambar Utama */}
              <div
                className="bd-image-box"
                onClick={() => inputUtamaRef.current?.click()}
                style={previewUtama ? { backgroundImage: `url(${previewUtama})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!previewUtama && (
                  <>
                    <span className="bd-plus-icon">+</span>
                    <p>Gambar Utama</p>
                  </>
                )}
                {previewUtama && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(setGambarUtamaFile, setPreviewUtama, inputUtamaRef); }}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, lineHeight: '22px' }}
                  >✕</button>
                )}
              </div>
              <input ref={inputUtamaRef} type="file" accept="image/*" hidden onChange={(e) => handleImageSelect(e, setGambarUtamaFile, setPreviewUtama)} />

              {/* Gambar 2 */}
              <div
                className="bd-image-box"
                onClick={() => input2Ref.current?.click()}
                style={preview2 ? { backgroundImage: `url(${preview2})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!preview2 && (
                  <>
                    <span className="bd-plus-icon">+</span>
                    <p>Gambar 2</p>
                  </>
                )}
                {preview2 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(setGambar2File, setPreview2, input2Ref); }}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, lineHeight: '22px' }}
                  >✕</button>
                )}
              </div>
              <input ref={input2Ref} type="file" accept="image/*" hidden onChange={(e) => handleImageSelect(e, setGambar2File, setPreview2)} />

              {/* Gambar 3 */}
              <div
                className="bd-image-box"
                onClick={() => input3Ref.current?.click()}
                style={preview3 ? { backgroundImage: `url(${preview3})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!preview3 && (
                  <>
                    <span className="bd-plus-icon">+</span>
                    <p>Gambar 3</p>
                  </>
                )}
                {preview3 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(setGambar3File, setPreview3, input3Ref); }}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, lineHeight: '22px' }}
                  >✕</button>
                )}
              </div>
              <input ref={input3Ref} type="file" accept="image/*" hidden onChange={(e) => handleImageSelect(e, setGambar3File, setPreview3)} />
            </div>
            <p className="bd-help-text">Pastikan ukuran gambar maksimal 2MB dan berformat .JPG / .PNG / .GIF. Dimensi yang direkomendasikan adalah 600x300 pixels.</p>
          </div>
        </section>

        {/* ===== DESKRIPSI PRODUK ===== */}
        <section className="bd-section">
          <label className="bd-label">Deskripsi Produk</label>
          <div className="bd-textarea-wrapper">
            <textarea
              className="bd-input bd-textarea"
              placeholder="Tulis deskripsi yang jelas dan mudah dimengerti oleh calon pembeli"
              rows="5"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              maxLength={3000}
            ></textarea>
            <div className="bd-char-count">{deskripsi.length} / 3000</div>
          </div>
        </section>

        {/* ===== INFORMASI STOK DAN HARGA ===== */}
        <section className="bd-section">
          <h3 className="bd-section-title">Informasi Stok dan Harga</h3>

          <div className="bd-form-group">
            <label className="bd-label">Harga Produk</label>
            <div className="bd-input-prefix">
              <span className="prefix">IDR</span>
              <input
                type="number"
                className="bd-input-borderless"
                placeholder="0"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                min="0"
              />
            </div>
            <div className="bd-input-underline"></div>
            <p className="bd-help-text">per 1 Item</p>
          </div>

          <div className="bd-toggle-group">
            <label className="bd-label" style={{ marginBottom: 0 }}>Gratis Ongkir</label>
            <label className="bd-switch">
              <input
                type="checkbox"
                checked={isGratisOngkir}
                onChange={(e) => setIsGratisOngkir(e.target.checked)}
              />
              <span className="bd-slider round"></span>
            </label>
          </div>

          <div className="bd-form-group">
            <label className="bd-label">Stok</label>
            <input
              type="number"
              className="bd-input-minimal"
              placeholder="0"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              min="0"
            />
            <div className="bd-input-underline"></div>
          </div>

          <div className="bd-form-group">
            <label className="bd-label">Satuan</label>
            <input
              type="text"
              className="bd-input"
              placeholder="Contoh: kg, buah, pack, botol, karung"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
            />
          </div>

          <div className="bd-form-group">
            <label className="bd-label">Minimal Pesanan</label>
            <input
              type="number"
              className="bd-input-minimal"
              placeholder="1"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              min="1"
            />
            <div className="bd-input-underline"></div>
            <p className="bd-help-text">x1 Item</p>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bd-submit-btn"
          disabled={isLoading}
          style={isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {isLoading ? 'Menyimpan...' : 'Buat Dagangan'}
        </button>
      </form>
    </div>
  );
}