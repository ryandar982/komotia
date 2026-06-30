// src/hooks/useSellerOrders.js
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export function useSellerOrders(idSeller) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idSeller) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        // Mengambil pesanan dan item pesanan sekaligus
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('id_seller', idSeller)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Memformat data agar sesuai dengan struktur frontend yang ada
        const formattedOrders = (data || []).map(order => ({
            id: order.id_order,
            invoice: order.invoice,
            buyerUsername: order.buyer_username,
            status: order.status,
            createdAt: order.created_at,
            totalAmount: order.total_amount,
            items: (order.order_items || []).map(item => ({
                id_order_item: item.id_order_item,
                productId: item.id_product,
                productName: item.product_name,
                category: item.category,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.image_url
            }))
        }));

        setOrders(formattedOrders);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [idSeller]);

  return { orders, loading, error };
}
