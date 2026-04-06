import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './PerformaToko.css';
import { UserRound , PackageOpen , PackageX , PackageCheck} from 'lucide-react';

export default function PerformaToko() {
  // Data dummy untuk statistik toko
  const stats = {
    pembeli: 142,
    selesai: 320,
    dibatalkan: 5
  };

  // Data dummy untuk grafik pendapatan (7 hari terakhir)
  const chartData = [
    { tanggal: '26', pendapatan: 150000 },
    { tanggal: '27', pendapatan: 280000 },
    { tanggal: '28', pendapatan: 120000 },
    { tanggal: '29', pendapatan: 450000 },
    { tanggal: '30', pendapatan: 300000 },
    { tanggal: '31', pendapatan: 550000 },
    { tanggal: '1', pendapatan: 420000 },
  ];

  // Custom Tooltip untuk mempercantik hover pada grafik
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pt-tooltip">
          <p className="pt-tooltip-date">{`Tgl ${label}`}</p>
          <p className="pt-tooltip-value">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pt-wrapper">
      <div className="pt-card">
        {/* BAGIAN STATISTIK TOKO */}
        <div className="pt-section">
          <div className="pt-section-header">
            <h3 className="pt-title">Statistik Toko</h3>
            <p className="pt-subtitle">Data dari 30 hari terakhir</p>
          </div>

          <div className="pt-stats-grid">
            {/* Item Statistik 1 */}
            <div className="pt-stat-item">
              <p className="pt-stat-label">Jumlah Pembeli</p>
              <div className="pt-stat-value-wrapper">
                <span className="pt-icon" role="img" aria-label="pembeli"><UserRound/></span>
                <span className="pt-value">{stats.pembeli}</span>
              </div>
            </div>

            {/* Item Statistik 2 */}
            <div className="pt-stat-item">
              <p className="pt-stat-label">Pesanan Selesai</p>
              <div className="pt-stat-value-wrapper">
                <span className="pt-icon" role="img" aria-label="selesai"><PackageCheck/></span>
                <span className="pt-value">{stats.selesai}</span>
              </div>
            </div>

            {/* Item Statistik 3 */}
            <div className="pt-stat-item">
              <p className="pt-stat-label">Pesanan dibatalkan</p>
              <div className="pt-stat-value-wrapper">
                <span className="pt-icon" role="img" aria-label="batal"><PackageX/></span>
                <span className="pt-value">{stats.dibatalkan}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="pt-divider" />

        {/* BAGIAN PENDAPATAN & GRAFIK */}
        <div className="pt-section">
          <div className="pt-revenue-header">
            <div>
              <h3 className="pt-title">Pendapatan</h3>
              <p className="pt-subtitle">Data dari 7 hari terakhir</p>
            </div>
            <a href="#detail" className="pt-link-more">Lihat Selengkapnya</a>
          </div>

          <div className="pt-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {/* Garis putus-putus background */}
                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                
                {/* Sumbu X (Tanggal) */}
                <XAxis 
                  dataKey="tanggal" 
                  axisLine={true} 
                  tickLine={true} 
                  tick={{ fontSize: 12, fill: '#6b7280' }} 
                  dy={10}
                />
                
                {/* Sumbu Y (Angka) */}
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`} // Format angka jadi k (ribuan)
                />
                
                {/* Efek Hover */}
                <Tooltip content={<CustomTooltip />} />
                
                {/* Garis Grafiknya */}
                <Line 
                  type="monotone" 
                  dataKey="pendapatan" 
                  stroke="#4B5320" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="pt-chart-footer">
            26 Mar - 1 Apr
          </div>
        </div>

      </div>
    </div>
  );
}