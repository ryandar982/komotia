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

export default function UserDashMain({ data, walletBalance }) {
  const iconSize = 28;
  const iconStroke = 2;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className='dashmain-container'>
        <strong>Aktivitas User</strong>
        <section className='dashmain-content first'>

            <div>Sedang Dikirim
                <div className='seller-icon-bar'>
                <Truck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data?.sedang_dikirim || 0}</h3>
            </div>
            </div>
            <div>Dalam Proses Pembatalan
                <div className='seller-icon-bar'>
                <PackageX className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data?.dibatalkan || 0}</h3>
            </div>
            </div>
            <div>Selesai
                <div className='seller-icon-bar'>
                <PackageCheck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data?.selesai || 0}</h3>
            </div>
            </div>
        </section>
        
        <strong>Keuangan</strong>
        <section className='dashmain-content second'>
            <div>Transaksi Berjalan
                <div className='seller-icon-bar second'>
                    <Banknote className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                    <h3>{formatRupiah(data?.nilai_transaksi_aktif || 0)}</h3>
                </div>
            </div>
            <div className='seller-kanan'>Saldo Saya
                <div className='seller-icon-bar second'>
                    <Wallet2 className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                    <h3>{formatRupiah(walletBalance || 0)}</h3>
                </div>
            </div>
        </section>
    </div>
  )
}