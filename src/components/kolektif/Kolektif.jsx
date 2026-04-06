import React from 'react';
import './Kolektif.css';
import { Users, ShoppingBag } from 'lucide-react';

export default function Kolektif() {
  // Data simulasi produk kolektif
  const dataKolektif = [
    {
      id: 1,
      nama: "Pupuk Organik Bang Doel | 1 Karung",
      gambar: "asset/images/pupuk-organik-stock.jpeg", // Ganti dengan path gambarmu
      hargaNormal: 50000,
      hargaKolektif: 42500,
      terkumpul: 2,
      target: 5
    },
    {
      id: 2,
      nama: "Bibit Jagung Kering | 1 Karung",
      gambar: "asset/images/bibit-jagung-stock.jpeg", // Ganti dengan path gambarmu
      hargaNormal: 120000,
      hargaKolektif: 102000,
      terkumpul: 3,
      target: 10
    }
  ];

  return (
    <section className='kolektif-container'>
      <div className='kolektif-text'>
        {/* Ikon grup orang dari Lucide */}
        <img src='asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' />
        <h2>Pembelian Kolektif</h2>
        <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
      </div>
      
      <div className='kolektif-content'>
        {dataKolektif.map((item) => {
          // Menghitung persentase progress bar
          const progress = (item.terkumpul / item.target) * 100;
          
          return (
            <div key={item.id} className='kolektif-card'>
              <img src={item.gambar} alt={item.nama} className='kolektif-img' />
              
              <div className='kolektif-info'>
                <h3>{item.nama}</h3>
                
                <div className='kolektif-prices'>
                  <span className='price-normal'>Rp {item.hargaNormal.toLocaleString('id-ID')}</span>
                  <span className='price-kolektif'>Rp {item.hargaKolektif.toLocaleString('id-ID')}</span>
                </div>
                
                <div className='kolektif-progress-container'>
                  <div className='progress-text'>
                    <span>Terkumpul: <strong>{item.terkumpul}</strong></span>
                    <span>Target: <strong>{item.target}</strong></span>
                  </div>
                  <div className='progress-bar-bg'>
                    {/* Width bar otomatis menyesuaikan perhitungan progress */}
                    <div className='progress-bar-fill' style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                
                <button className='btn-gabung'>
                  <ShoppingBag size={18} />
                  Gabung Kolektif
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}