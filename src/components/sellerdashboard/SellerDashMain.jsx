import React from 'react';
import './SellerDashMain.css';
import PerformaToko from './PerformaToko';
import { 
  Banknote, 
  Wallet2, 
  PackageX, 
  ClipboardList, 
  Clock, 
  AlertTriangle, 
  Truck, 
  PackageMinus 
} from 'lucide-react';

export default function SellerDashMain() {
  // Kamu bisa mengatur variabel ukuran di sini agar mudah diubah sekaligus
  const iconSize = 28;
  const iconStroke = 2;

  return (
    <div className='dashmain-container'>
        <strong>Aktivitas Toko</strong>
        <section className='dashmain-content first'>
            <div>
            Perlu Diproses
            <div className='seller-icon-bar'>
                <ClipboardList className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>5</h3>
            </div>
            </div>
            <div>Menunggu Konfirmasi
                <div className='seller-icon-bar'>
                <Clock className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>12</h3>
            </div>
            </div>
            <div>Kendala Layanan
                <div className='seller-icon-bar'>
                <AlertTriangle className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>0</h3>
            </div>
            </div>
            <div>Sedang Dibatalkan
                <div className='seller-icon-bar'>
                <PackageX className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>13</h3>
            </div>
            </div>
            <div>Sedang Dikirim
                <div className='seller-icon-bar'>
                <Truck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>13</h3>
            </div>
            </div>
            <div>Stok Habis
                <div className='seller-icon-bar'>
                <PackageMinus className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>0</h3>
            </div>
            </div>
        </section>
        
        <strong>Keuangan Toko</strong>
        <section className='dashmain-content second'>
            <div>Transaksi Berjalan
                <div className='seller-icon-bar second'>
                    <Banknote size={iconSize} strokeWidth={iconStroke} />
                    <h3>Rp 327.025.000</h3>
                </div>
            </div>
            <div className='seller-kanan'>Saldo Toko
                <div className='seller-icon-bar second'>
                    <Wallet2 size={iconSize} strokeWidth={iconStroke} /> 
                    <h3>Rp 10.000.000</h3>
                </div>
            </div>
        </section>

        <strong>Performa Toko</strong>
        <section className='dashmain-content third'>
            <PerformaToko />
        </section>
    </div>
  )
}