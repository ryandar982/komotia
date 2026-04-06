import React from 'react';
import './UserDashMain.css';
import { 
  CreditCard, 
  Package, 
  PackageX, 
  PackageCheck, 
  Banknote, 
  Wallet2,
  Truck
} from 'lucide-react';

export default function UserDashMain() {
  // Variabel untuk menyeragamkan ukuran icon
  const iconSize = 28;
  const iconStroke = 2;

  return (
    <div className='dashmain-container'>
        <strong>Aktivitas User</strong>
        <section className='dashmain-content first'>
            <div>
            Menunggu Pembayaran
            <div className='seller-icon-bar'>
                <CreditCard className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>5</h3>
            </div>
            </div>
            <div>Sedang Dikirim
                <div className='seller-icon-bar'>
                <Truck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>12</h3>
            </div>
            </div>
            <div>Dalam Proses Pembatalan
                <div className='seller-icon-bar'>
                <PackageX className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>0</h3>
            </div>
            </div>
            <div>Selesai
                <div className='seller-icon-bar'>
                <PackageCheck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>0</h3>
            </div>
            </div>
        </section>
        
        <strong>Keuangan</strong>
        <section className='dashmain-content second'>
            <div>Transaksi Berjalan
                <div className='seller-icon-bar second'>
                    <Banknote className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                    <h3>Rp 327.020</h3>
                </div>
            </div>
            <div className='seller-kanan'>Saldo Saya
                <div className='seller-icon-bar second'>
                    <Wallet2 className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                    <h3>Rp 10.000.000</h3>
                </div>
            </div>
        </section>
        
    </div>
  )
}