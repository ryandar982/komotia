// src/hooks/useUserOrders.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useUserOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);

        // Fetch dari kedua sumber secara paralel
        const [viewResult, ordersResult] = await Promise.all([
          // 1. Ambil data lengkap dari v_order_history (alamat, kurir, metode bayar, detail item)
          supabase
            .from('v_order_history')
            .select('*')
            .eq('id_user', userId)
            .order('tanggal_transaksi', { ascending: false }),
          // 2. Ambil data dari tabel orders (status terbaru yang di-update seller)
          supabase
            .from('orders')
            .select('id_order, id_user, id_seller, status, total_amount, invoice, created_at, order_items(*)')
            .eq('id_user', userId)
            .order('created_at', { ascending: false })
        ]);

        if (viewResult.error) throw viewResult.error;

        // Group data dari v_order_history (untuk info detail transaksi)
        const groupedTransactions = {};
        (viewResult.data || []).forEach(row => {
          if (!groupedTransactions[row.id_transaction]) {
            groupedTransactions[row.id_transaction] = {
              id: row.id_transaction,
              date: row.tanggal_transaksi,
              totalAmount: row.total_harga,
              status: row.status, // Status dari transactions (bisa outdated)
              address: row.alamat_pengiriman,
              paymentMethod: row.metode_pembayaran,
              kurir: row.kurir,
              resi: row.nomor_resi,
              items: []
            };
          }
          groupedTransactions[row.id_transaction].items.push({
            id_detail: row.id_detail,
            id_product: row.id_product,
            productName: row.nama_product,
            quantity: row.jumlah,
            price: row.harga_satuan,
            subtotal: row.subtotal,
            imageUrl: row.gambar_utama,
            id_seller: row.id_seller,
            storeName: row.nama_toko
          });
        });

        let finalOrders = Object.values(groupedTransactions);

        // Jika ada data dari tabel orders (status terbaru dari seller), 
        // update status di data transaksi user
        if (!ordersResult.error && ordersResult.data && ordersResult.data.length > 0) {
          // Buat map status terbaru dari tabel orders, cocokkan berdasarkan total_amount dan id_seller
          const sellerOrders = ordersResult.data;

          finalOrders = finalOrders.map(trx => {
            // Cari order yang cocok berdasarkan total amount (paling mendekati)
            const matchingOrder = sellerOrders.find(ord => 
              ord.total_amount === trx.totalAmount
            );

            if (matchingOrder) {
              return {
                ...trx,
                status: matchingOrder.status // Gunakan status terbaru dari tabel orders
              };
            }
            return trx;
          });
        }

        setOrders(finalOrders);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userId]);

  return { orders, loading, error };
}
