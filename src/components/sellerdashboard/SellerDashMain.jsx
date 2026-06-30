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

export default function SellerDashMain({ seller }) {
  const iconSize = 28;
  const iconStroke = 2;

  // Nilai default jika seller belum ada
  const data = seller || {};

  return (
    <div className='dashmain-container'>
        <strong>Aktivitas Toko</strong>
        <section className='dashmain-content first'>
            <div>
            Perlu Diproses
            <div className='seller-icon-bar'>
                <ClipboardList className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.perlu_diproses || 0}</h3>
            </div>
            </div>
            <div>Menunggu Konfirmasi
                <div className='seller-icon-bar'>
                <Clock className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.menunggu_konfirmasi || 0}</h3>
            </div>
            </div>
            <div>Kendala Layanan
                <div className='seller-icon-bar'>
                <AlertTriangle className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.kendala_layanan || 0}</h3>
            </div>
            </div>
            <div>Sedang Dibatalkan
                <div className='seller-icon-bar'>
                <PackageX className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.sedang_dibatalkan || 0}</h3>
            </div>
            </div>
            <div>Sedang Dikirim
                <div className='seller-icon-bar'>
                <Truck className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.sedang_dikirim || 0}</h3>
            </div>
            </div>
            <div>Stok Habis
                <div className='seller-icon-bar'>
                <PackageMinus className='seller-dash-icon' size={iconSize} strokeWidth={iconStroke} />
                <h3>{data.stok_habis || 0}</h3>
            </div>
            </div>
        </section>
        
        <strong>Keuangan Toko</strong>
        <section className='dashmain-content second'>
            <div>Transaksi Berjalan
                <div className='seller-icon-bar second'>
                    <Banknote size={iconSize} strokeWidth={iconStroke} />
                    <h3>Rp {Number(data.transaksi_berjalan || 0).toLocaleString('id-ID')}</h3>
                </div>
            </div>
            <div className='seller-kanan'>Saldo Toko
                <div className='seller-icon-bar second'>
                    <Wallet2 size={iconSize} strokeWidth={iconStroke} /> 
                    <h3>Rp {Number(data.saldo_toko || 0).toLocaleString('id-ID')}</h3>
                </div>
            </div>
        </section>

        <strong>Performa Toko</strong>
        <section className='dashmain-content third'>
            <PerformaToko seller={data} />
        </section>
    </div>
  )
}