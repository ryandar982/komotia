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
        // We will fetch from v_order_history and group by id_transaction
        const { data, error } = await supabase
          .from('v_order_history')
          .select('*')
          .eq('id_user', userId)
          .order('tanggal_transaksi', { ascending: false });

        if (error) throw error;

        // Group the flat view rows by transaction ID
        const groupedOrders = {};
        
        (data || []).forEach(row => {
          if (!groupedOrders[row.id_transaction]) {
            groupedOrders[row.id_transaction] = {
              id: row.id_transaction,
              date: row.tanggal_transaksi,
              totalAmount: row.total_harga,
              status: row.status,
              address: row.alamat_pengiriman,
              paymentMethod: row.metode_pembayaran,
              kurir: row.kurir,
              resi: row.nomor_resi,
              items: []
            };
          }
          
          groupedOrders[row.id_transaction].items.push({
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

        // Convert object back to array
        const formattedOrders = Object.values(groupedOrders);
        setOrders(formattedOrders);
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
