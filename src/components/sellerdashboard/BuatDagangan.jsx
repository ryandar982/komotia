import React from 'react';
import './BuatDagangan.css';

export default function BuatDagangan() {
  return (
    <div className="bd-container">
      <h2 className="bd-title">Buat Produk</h2>
      
      {/* TIPE DAGANGAN SECTION */}
      <section className="bd-section">
        <h3 className="bd-section-title">Tipe Produk</h3>
        <div className="bd-form-group">
          <select className="bd-input bd-select">
            <option>Pupuk Organik</option>
            <option>Pupuk Anorganik</option>
            <option>Bibit Tanaman</option>
            <option>Pestisida Alami</option>
          </select>
        </div>
        
        <div className="bd-form-group">
          <select className="bd-input bd-select">
            <option></option>
          </select>
        </div>
      </section>

      {/* INFORMASI PRODUK SECTION */}
      <section className="bd-section">
        <h3 className="bd-section-title">Informasi Produk</h3>
        
        <div className="bd-alert bd-alert-info">
          <span className="bd-icon">ℹ️</span>
          <p>Informasi dan kategori produk tidak bisa diubah setelah produk disimpan.</p>
        </div>

        <div className="bd-form-group">
          <label className="bd-label">Pilih Variasi Produk</label>
          <select className="bd-input bd-select-placeholder">
            <option value="" disabled selected>Masukkan nama item yang kamu jual</option>
          </select>
        </div>

        <div className="bd-form-group">
          <label className="bd-label">Gambar Produk</label>
          <div className="bd-image-upload-container">
            <div className="bd-image-box">
              <span className="bd-plus-icon">+</span>
              <p>Gambar Utama</p>
            </div>
            <div className="bd-image-box">
              <span className="bd-plus-icon">+</span>
              <p>Gambar 2</p>
            </div>
            <div className="bd-image-box">
              <span className="bd-plus-icon">+</span>
              <p>Gambar 3</p>
            </div>
          </div>
          <p className="bd-help-text">Pastikan ukuran gambar maksimal 2MB dan berformat .JPG / .PNG / .GIF. Dimensi yang direkomendasikan adalah 600x300 pixels.</p>
        </div>
      </section>

      {/* DESKRIPSI PRODUK SECTION */}
      <section className="bd-section">
        <label className="bd-label">Deskripsi Produk</label>
        <div className="bd-textarea-wrapper">
          <textarea 
            className="bd-input bd-textarea" 
            placeholder="Tulis deskripsi yang jelas dan mudah dimengerti oleh calon pembeli"
            rows="5"
          ></textarea>
          <div className="bd-char-count">0 / 3000</div>
        </div>
      </section>

      {/* INFORMASI STOK DAN HARGA SECTION */}
      <section className="bd-section">
        <h3 className="bd-section-title">Informasi Stok dan Harga</h3>
        
        <div className="bd-form-group">
          <label className="bd-label">Harga Produk</label>
          <div className="bd-input-prefix">
            <span className="prefix">IDR</span>
            <input type="number" className="bd-input-borderless" placeholder="0" />
          </div>
          <div className="bd-input-underline"></div>
          <p className="bd-help-text">per 1 Item</p>
        </div>

        <div className="bd-toggle-group">
          <label className="bd-label">Aktifkan harga grosir</label>
          <label className="bd-switch">
            <input type="checkbox" />
            <span className="bd-slider round"></span>
          </label>
        </div>

        <div className="bd-form-group">
          <label className="bd-label">Stok</label>
          <input type="number" className="bd-input-minimal" placeholder="0" />
          <div className="bd-input-underline"></div>
          <p className="bd-help-text">x1 Item =</p>
        </div>

        <div className="bd-form-group">
          <label className="bd-label">Minimal Pesanan</label>
          <input type="number" className="bd-input-minimal" placeholder="0" />
          <div className="bd-input-underline"></div>
          <p className="bd-help-text">x1 Item =</p>
        </div>
      </section>

      {/* SUBMIT BUTTON */}
      <button className="bd-submit-btn">Buat Dagangan</button>
    </div>
  );
}