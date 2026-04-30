import React, { useState } from 'react';
import './RiwayatPesanan.css';
import Pesanan from './ItemPesanan';

export default function RiwayatPesanan({ orders = [] }) {
  // Set default tab ke 'Semua Pesanan' atau 'Perlu Diproses'
  const [activeTab, setActiveTab] = useState('Semua Pesanan');

  const tabs = [
    'Perlu Diproses',
    'Menunggu Konfirmasi',
    'Pesanan Selesai',
    'Sedang Dibatalkan',
    'Pesanan Dibatalkan',
    'Semua Pesanan'
  ];

  // Logika filter: jika tab "Semua Pesanan", tampilkan semua. 
  // Jika tidak, filter berdasarkan status pesanan.
  const filteredOrders = activeTab === 'Semua Pesanan' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="rp-container">
      {/* HEADER SECTION */}
      <div className="rp-header">
        <h2 className="rp-title">Riwayat Pesanan</h2>
      </div>

      {/* FILTER & TAB SECTION */}
      <div className="rp-top-card">
        {/* TABS */}
        <div className="rp-tabs">
          {tabs.map((tab) => (
            <div 
              key={tab}
              className={`rp-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{ cursor: 'pointer' }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* CONTROLS (SEARCH & DROPDOWNS) */}
        <div className="rp-controls">
          <select className="rp-select rp-select-medium">
            <option>Pilih Filter</option>
          </select>

          <select className="rp-select rp-select-medium">
            <option>Terlama</option>
          </select>
        </div>

        {/* TAGS / PILLS */}
        <div className="rp-tags">
          <button className="rp-tag active">{activeTab}</button>
        </div>
      </div>
      
      {/* RENDER KONDISIONAL: Tampilkan List Pesanan ATAU Empty State */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          // Mengoper data order individual ke komponen ItemPesanan
          <Pesanan key={order.id} order={order} />
        ))
      ) : (
        <div className="rp-bottom-card">
          <div className="rp-empty-state">
            <p className="rp-empty-text">Kamu belum memiliki pesanan untuk kategori ini</p>
          </div>
        </div>
      )}

    </div>
  );
}