import React from 'react';
import './Kolektif.css';
import { ShoppingBag } from 'lucide-react';
// Import data dummy products Anda
import { dummyProducts } from '../../data/dummyProducts'; 

export default function Kolektif() {
  // Fungsi helper untuk mengambil data produk asli berdasarkan ID
  const getProduct = (id) => dummyProducts.find(p => p.id === id);

  // Data simulasi kolektif yang merujuk pada dummyProducts
  const dataKolektif = [
    {
      id_kolektif: 1,
      product: getProduct(1), // Merujuk ke Pupuk Organik Bang Doel
      hargaKolektif: 42500,    // Harga diskon kolektif
      terkumpul: 2,
      target: 5
    },
    {
      id_kolektif: 2,
      product: getProduct(7), // Merujuk ke Bibit Jagung Hibrida Bisi 18
      hargaKolektif: 80000,    // Harga diskon kolektif
      terkumpul: 3,
      target: 10
    }
  ];

  return (
    <section className='kolektif-container'>
      <div className='kolektif-text'>
        <img src='/asset/images/kolektif-icon.png' height='120' className='kolektif-header-icon' alt="Kolektif Icon" />
        <h2>Pembelian Kolektif</h2>
        <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
      </div>
      
      <div className='kolektif-content'>
        {dataKolektif.map((item) => {
          const { product, hargaKolektif, terkumpul, target } = item;
          
          // Fallback jika produk tidak ditemukan
          if (!product) return null;

          const progress = (terkumpul / target) * 100;
          
          return (
            <div key={item.id_kolektif} className='kolektif-card'>
              {/* Menggunakan image dari dummyProducts */}
              <img src={product.image} alt={product.name} className='kolektif-img' />
              
              <div className='kolektif-info'>
                {/* Menggunakan name dari dummyProducts */}
                <h3>{product.name}</h3>
                
                <div className='kolektif-prices'>
                  {/* Menggunakan price asli dari dummyProducts sebagai harga normal */}
                  <span className='price-normal'>Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className='price-kolektif'>Rp {hargaKolektif.toLocaleString('id-ID')}</span>
                </div>
                
                <div className='kolektif-progress-container'>
                  <div className='progress-text'>
                    <span>Terkumpul: <strong>{terkumpul}</strong></span>
                    <span>Target: <strong>{target}</strong></span>
                  </div>
                  <div className='progress-bar-bg'>
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