// src/hooks/useKolektif.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';

/**
 * Hook untuk mengelola data pembelian kolektif dari Supabase.
 * - Fetch kampanye aktif beserta data produk (join)
 * - Realtime subscription untuk update progress live
 * - Fungsi joinKolektif & leaveKolektif
 */
export function useKolektif() {
  const [kolektifs, setKolektifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch semua kampanye kolektif aktif
  const fetchKolektifs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('collective_purchases')
        .select(`
          *,
          products (
            id_product,
            nama_product,
            harga,
            gambar_utama,
            rating,
            jumlah_ulasan,
            stok,
            satuan,
            is_gratis_ongkir,
            id_seller,
            sellers (
              id_seller,
              nama_toko,
              kota
            )
          ),
          collective_participants (
            id,
            id_user,
            quantity,
            joined_at,
            status
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setKolektifs(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching kolektif:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKolektifs();

    // Realtime: subscribe ke perubahan collective_purchases & collective_participants
    const channel = supabase
      .channel('kolektif-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collective_purchases' },
        () => {
          fetchKolektifs();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'collective_participants' },
        () => {
          fetchKolektifs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchKolektifs]);

  /**
   * Gabung ke kampanye kolektif
   * @param {number} idCollective - ID kampanye kolektif
   * @param {number} idUser - ID user yang bergabung
   * @param {number} quantity - Jumlah yang ingin dibeli
   * @returns {{ success: boolean, error?: string }}
   */
  const joinKolektif = async (idCollective, idUser, quantity = 1) => {
    try {
      // 1. Cek apakah user sudah pernah bergabung
      const { data: existing, error: checkError } = await supabase
        .from('collective_participants')
        .select('id')
        .eq('id_collective', idCollective)
        .eq('id_user', idUser)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        return { success: false, error: 'Kamu sudah bergabung di pembelian kolektif ini.' };
      }

      // 2. Cek apakah kampanye masih aktif dan belum melebihi target
      const { data: campaign, error: campaignError } = await supabase
        .from('collective_purchases')
        .select('target, terkumpul, status, deadline')
        .eq('id', idCollective)
        .single();

      if (campaignError) throw campaignError;

      if (campaign.status !== 'active') {
        return { success: false, error: 'Kampanye kolektif ini sudah tidak aktif.' };
      }

      if (campaign.deadline && new Date(campaign.deadline) < new Date()) {
        return { success: false, error: 'Kampanye kolektif ini sudah melewati batas waktu.' };
      }

      if (campaign.terkumpul + quantity > campaign.target) {
        return { success: false, error: `Sisa kuota hanya ${campaign.target - campaign.terkumpul} lagi.` };
      }

      // 3. Insert participant
      const { error: insertError } = await supabase
        .from('collective_participants')
        .insert({
          id_collective: idCollective,
          id_user: idUser,
          quantity: quantity,
          status: 'joined'
        });

      if (insertError) throw insertError;

      // 4. Update terkumpul di collective_purchases
      const newTerkumpul = campaign.terkumpul + quantity;
      const newStatus = newTerkumpul >= campaign.target ? 'fulfilled' : 'active';

      const { error: updateError } = await supabase
        .from('collective_purchases')
        .update({
          terkumpul: newTerkumpul,
          status: newStatus
        })
        .eq('id', idCollective);

      if (updateError) throw updateError;

      // 5. Refetch data
      await fetchKolektifs();

      return { success: true, fulfilled: newStatus === 'fulfilled' };
    } catch (err) {
      console.error('Error joining kolektif:', err);
      return { success: false, error: err.message || 'Terjadi kesalahan.' };
    }
  };

  /**
   * Cek apakah user sudah bergabung di kampanye tertentu
   */
  const isUserJoined = (idCollective, idUser) => {
    const campaign = kolektifs.find(k => k.id === idCollective);
    if (!campaign || !campaign.collective_participants) return false;
    return campaign.collective_participants.some(
      p => p.id_user === idUser && p.status === 'joined'
    );
  };

  return {
    kolektifs,
    loading,
    error,
    joinKolektif,
    isUserJoined,
    refetch: fetchKolektifs
  };
}
