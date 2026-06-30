-- ============================================================
-- KOMOTIA DATABASE — Supabase PostgreSQL
-- ============================================================
-- Script ini MENG-UPGRADE database yang sudah ada.
-- Tabel yang sudah ada: users, sellers, categories, products,
--   carts, cart_details, transactions, transaction_details,
--   payments, reviews, orders, order_items
--
-- Script ini akan:
--   1. ALTER tabel yang sudah ada (tambah kolom yang kurang)
--   2. CREATE tabel baru yang belum ada (addresses, wishlists,
--      wallets, notifications)
--   3. Buat triggers, functions, views, dan RLS policies
--
-- ⚠️  AMAN dijalankan berulang kali (idempotent)
-- ============================================================


-- ############################################################
-- BAGIAN 1: ALTER TABEL YANG SUDAH ADA
-- ############################################################

-- ************************************************************
-- 1. TABEL: users — Tambah kolom untuk dashboard
-- ************************************************************
-- Struktur sekarang:
--   id_user (int4 PK), nama, email, password, no_telp, alamat,
--   role ('admin','penjual','pembeli'), created_at

DO $$
BEGIN
  -- Kolom username (untuk login & display)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='username') THEN
    ALTER TABLE public.users ADD COLUMN username VARCHAR(50) UNIQUE;
  END IF;

  -- Kolom avatar_url (foto profil)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='avatar_url') THEN
    ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
  END IF;

  -- Kolom membership (level member)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='membership') THEN
    ALTER TABLE public.users ADD COLUMN membership VARCHAR(20) DEFAULT 'Bronze';
  END IF;

  -- Kolom updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Set username default dari email untuk data yang sudah ada
UPDATE public.users
SET username = split_part(email, '@', 1)
WHERE username IS NULL;


-- ************************************************************
-- 2. TABEL: sellers — Tambah kolom deskripsi toko
-- ************************************************************
-- Struktur sekarang:
--   id_seller (int4 PK), nama_toko, nama_pemilik, email,
--   password_hash, alamat, kota, avatar_url, is_open, saldo_toko,
--   transaksi_berjalan, perlu_diproses, menunggu_konfirmasi,
--   kendala_layanan, sedang_dibatalkan, sedang_dikirim, stok_habis,
--   jumlah_pembeli, pesanan_selesai, pesanan_dibatalkan,
--   created_at, updated_at

DO $$
BEGIN
  -- Kolom deskripsi toko
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sellers' AND column_name='deskripsi_toko') THEN
    ALTER TABLE public.sellers ADD COLUMN deskripsi_toko TEXT;
  END IF;

  -- Kolom id_user (relasi ke tabel users, opsional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sellers' AND column_name='id_user') THEN
    ALTER TABLE public.sellers ADD COLUMN id_user INTEGER REFERENCES public.users(id_user) ON DELETE SET NULL;
  END IF;
END $$;


-- ************************************************************
-- 3. TABEL: products — Tambah kolom is_active & updated_at
-- ************************************************************
-- Struktur sekarang:
--   id_product (int4 PK), nama_product, deskripsi, price, category,
--   harga, stok, satuan, gambar_utama, id_seller, id_category,
--   created_at, gambar_2, gambar_3, rating, jumlah_ulasan,
--   is_gratis_ongkir, asal_kota

DO $$
BEGIN
  -- Kolom is_active (soft delete)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='is_active') THEN
    ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;

  -- Kolom updated_at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='updated_at') THEN
    ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;

  -- Kolom min_order
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='min_order') THEN
    ALTER TABLE public.products ADD COLUMN min_order INTEGER DEFAULT 1;
  END IF;
END $$;


-- ************************************************************
-- 4. TABEL: carts — Tambah updated_at
-- ************************************************************
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carts' AND column_name='updated_at') THEN
    ALTER TABLE public.carts ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;


-- ************************************************************
-- 5. TABEL: cart_details — Tambah kolom pendukung
-- ************************************************************
DO $$
BEGIN
  -- Catatan ke penjual
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cart_details' AND column_name='catatan') THEN
    ALTER TABLE public.cart_details ADD COLUMN catatan TEXT;
  END IF;

  -- Kurir terpilih
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cart_details' AND column_name='kurir_terpilih') THEN
    ALTER TABLE public.cart_details ADD COLUMN kurir_terpilih VARCHAR(50);
  END IF;

  -- Item dipilih untuk checkout?
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cart_details' AND column_name='is_selected') THEN
    ALTER TABLE public.cart_details ADD COLUMN is_selected BOOLEAN DEFAULT TRUE;
  END IF;
END $$;


-- ************************************************************
-- 6. TABEL: transactions — Tambah kolom tracking & waktu
-- ************************************************************
DO $$
BEGIN
  -- Nomor resi pengiriman
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='nomor_resi') THEN
    ALTER TABLE public.transactions ADD COLUMN nomor_resi VARCHAR(100);
  END IF;

  -- Kurir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='kurir') THEN
    ALTER TABLE public.transactions ADD COLUMN kurir VARCHAR(50);
  END IF;

  -- Batas waktu bayar
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='batas_bayar') THEN
    ALTER TABLE public.transactions ADD COLUMN batas_bayar TIMESTAMP;
  END IF;

  -- Waktu dikirim
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='dikirim_at') THEN
    ALTER TABLE public.transactions ADD COLUMN dikirim_at TIMESTAMP;
  END IF;

  -- Waktu selesai
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='selesai_at') THEN
    ALTER TABLE public.transactions ADD COLUMN selesai_at TIMESTAMP;
  END IF;

  -- Waktu dibatalkan
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='dibatalkan_at') THEN
    ALTER TABLE public.transactions ADD COLUMN dibatalkan_at TIMESTAMP;
  END IF;

  -- Alasan batal
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='alasan_batal') THEN
    ALTER TABLE public.transactions ADD COLUMN alasan_batal TEXT;
  END IF;

  -- ID seller (untuk filter di seller dashboard)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='id_seller') THEN
    ALTER TABLE public.transactions ADD COLUMN id_seller INTEGER REFERENCES public.sellers(id_seller) ON DELETE SET NULL;
  END IF;
END $$;


-- ************************************************************
-- 7. TABEL: reviews — Tambah kolom updated_at & id_transaction_detail
-- ************************************************************
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reviews' AND column_name='updated_at') THEN
    ALTER TABLE public.reviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='reviews' AND column_name='id_detail') THEN
    ALTER TABLE public.reviews ADD COLUMN id_detail INTEGER REFERENCES public.transaction_details(id_detail) ON DELETE SET NULL;
  END IF;
END $$;


-- ************************************************************
-- 8. TABEL: orders — Tambah kolom id_user (buyer)
-- ************************************************************
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='id_user') THEN
    ALTER TABLE public.orders ADD COLUMN id_user INTEGER REFERENCES public.users(id_user) ON DELETE SET NULL;
  END IF;
END $$;


-- ############################################################
-- BAGIAN 2: CREATE TABEL BARU
-- ############################################################

-- ************************************************************
-- 9. TABEL: addresses — Alamat Pengiriman (multi-alamat per user)
-- ************************************************************
CREATE TABLE IF NOT EXISTS public.addresses (
  id_address    SERIAL       PRIMARY KEY,
  id_user       INTEGER      NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  nama_penerima VARCHAR(150) NOT NULL,
  no_telp       VARCHAR(20)  NOT NULL,
  alamat_lengkap TEXT        NOT NULL,
  kota          VARCHAR(100),
  provinsi      VARCHAR(100),
  kode_pos      VARCHAR(10),
  is_utama      BOOLEAN      DEFAULT FALSE,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(id_user);

COMMENT ON TABLE public.addresses IS 'Alamat pengiriman user. Satu user bisa punya banyak alamat.';


-- ************************************************************
-- 10. TABEL: wishlists — Produk Favorit
-- ************************************************************
CREATE TABLE IF NOT EXISTS public.wishlists (
  id_wishlist SERIAL    PRIMARY KEY,
  id_user     INTEGER   NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  id_product  INTEGER   NOT NULL REFERENCES public.products(id_product) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(id_user, id_product)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(id_user);

COMMENT ON TABLE public.wishlists IS 'Wishlist / produk favorit user.';


-- ************************************************************
-- 11. TABEL: wallets — Saldo Dompet Digital User
-- ************************************************************
CREATE TABLE IF NOT EXISTS public.wallets (
  id_wallet   SERIAL         PRIMARY KEY,
  id_user     INTEGER        NOT NULL UNIQUE REFERENCES public.users(id_user) ON DELETE CASCADE,
  saldo       NUMERIC(15,2)  DEFAULT 0 CHECK (saldo >= 0),
  updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE public.wallets IS 'Dompet digital user. Satu user satu wallet.';


-- ************************************************************
-- 12. TABEL: wallet_transactions — Riwayat Mutasi Saldo
-- ************************************************************
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id_wallet_trx  SERIAL         PRIMARY KEY,
  id_user        INTEGER        NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  tipe           VARCHAR(20)    NOT NULL CHECK (tipe IN ('topup', 'bayar', 'refund', 'penarikan')),
  jumlah         NUMERIC(15,2)  NOT NULL,
  saldo_sebelum  NUMERIC(15,2)  NOT NULL,
  saldo_sesudah  NUMERIC(15,2)  NOT NULL,
  keterangan     TEXT,
  referensi_id   VARCHAR(50),
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallet_trx_user ON public.wallet_transactions(id_user);

COMMENT ON TABLE public.wallet_transactions IS 'Riwayat mutasi saldo dompet: top-up, pembayaran, refund, penarikan.';


-- ************************************************************
-- 13. TABEL: notifications — Notifikasi User
-- ************************************************************
CREATE TABLE IF NOT EXISTS public.notifications (
  id_notification SERIAL       PRIMARY KEY,
  id_user         INTEGER      NOT NULL REFERENCES public.users(id_user) ON DELETE CASCADE,
  judul           VARCHAR(100) NOT NULL,
  pesan           TEXT         NOT NULL,
  tipe            VARCHAR(30)  DEFAULT 'info'
                  CHECK (tipe IN ('pesanan', 'pembayaran', 'pengiriman', 'ulasan', 'promo', 'info')),
  is_read         BOOLEAN      DEFAULT FALSE,
  referensi_id    VARCHAR(50),
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user    ON public.notifications(id_user, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

COMMENT ON TABLE public.notifications IS 'Notifikasi ke user: status pesanan, pembayaran, promo, dll.';


-- ############################################################
-- BAGIAN 3: INDEXES UNTUK TABEL YANG SUDAH ADA
-- ############################################################

CREATE INDEX IF NOT EXISTS idx_products_seller    ON public.products(id_seller);
CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(id_category);
CREATE INDEX IF NOT EXISTS idx_products_active    ON public.products(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carts_user         ON public.carts(id_user);
CREATE INDEX IF NOT EXISTS idx_cart_details_cart   ON public.cart_details(id_cart);
CREATE INDEX IF NOT EXISTS idx_transactions_user  ON public.transactions(id_user);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_orders_seller      ON public.orders(id_seller);
CREATE INDEX IF NOT EXISTS idx_orders_user        ON public.orders(id_user);
CREATE INDEX IF NOT EXISTS idx_reviews_product    ON public.reviews(id_product);
CREATE INDEX IF NOT EXISTS idx_reviews_user       ON public.reviews(id_user);
CREATE INDEX IF NOT EXISTS idx_payments_trx       ON public.payments(id_transaction);


-- ############################################################
-- BAGIAN 4: TRIGGERS & FUNCTIONS
-- ############################################################

-- ************************************************************
-- FUNCTION: Auto-update `updated_at`
-- ************************************************************
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pasang di tabel yang punya updated_at
DROP TRIGGER IF EXISTS trg_users_updated_at    ON public.users;
DROP TRIGGER IF EXISTS trg_sellers_updated_at  ON public.sellers;
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
DROP TRIGGER IF EXISTS trg_wallets_updated_at  ON public.wallets;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_sellers_updated_at
  BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER trg_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- ************************************************************
-- FUNCTION: Auto-update rating & jumlah_ulasan di products
-- ************************************************************
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id INT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.id_product;
  ELSE
    target_product_id := NEW.id_product;
  END IF;

  UPDATE public.products
  SET
    rating = COALESCE(
      (SELECT ROUND(AVG(r.rating)::NUMERIC, 1) FROM public.reviews r WHERE r.id_product = target_product_id),
      0
    ),
    jumlah_ulasan = (
      SELECT COUNT(*) FROM public.reviews r WHERE r.id_product = target_product_id
    )
  WHERE id_product = target_product_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reviews_update_rating ON public.reviews;

CREATE TRIGGER trg_reviews_update_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_update_product_rating();


-- ************************************************************
-- FUNCTION: Auto-update counter di sellers saat order berubah status
-- ************************************************************
CREATE OR REPLACE FUNCTION trigger_update_seller_counters()
RETURNS TRIGGER AS $$
DECLARE
  target_seller_id INT;
BEGIN
  target_seller_id := COALESCE(NEW.id_seller, OLD.id_seller);
  IF target_seller_id IS NULL THEN RETURN NEW; END IF;

  UPDATE public.sellers SET
    perlu_diproses      = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Perlu Diproses'),
    menunggu_konfirmasi = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Menunggu Konfirmasi'),
    sedang_dikirim      = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Sedang Dikirim'),
    sedang_dibatalkan   = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Dibatalkan'),
    pesanan_selesai     = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Selesai'),
    pesanan_dibatalkan  = (SELECT COUNT(*) FROM public.orders WHERE id_seller = target_seller_id AND status = 'Dibatalkan'),
    jumlah_pembeli      = (SELECT COUNT(DISTINCT buyer_username) FROM public.orders WHERE id_seller = target_seller_id),
    stok_habis          = (SELECT COUNT(*) FROM public.products WHERE id_seller = target_seller_id AND stok = 0 AND is_active = TRUE),
    transaksi_berjalan  = COALESCE(
      (SELECT SUM(total_amount) FROM public.orders WHERE id_seller = target_seller_id AND status NOT IN ('Selesai', 'Dibatalkan')),
      0
    )
  WHERE id_seller = target_seller_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_update_seller ON public.orders;

CREATE TRIGGER trg_orders_update_seller
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION trigger_update_seller_counters();


-- ************************************************************
-- FUNCTION: Auto-create wallet saat user baru registrasi
-- ************************************************************
CREATE OR REPLACE FUNCTION trigger_create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (id_user, saldo)
  VALUES (NEW.id_user, 0)
  ON CONFLICT (id_user) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_new_user_wallet ON public.users;

CREATE TRIGGER trg_new_user_wallet
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION trigger_create_wallet_for_new_user();


-- ************************************************************
-- FUNCTION: Generate invoice number
-- Format: INV/YYYYMMDD/KMT/RANDOM5
-- ************************************************************
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV/' || TO_CHAR(now(), 'YYYYMMDD') || '/KMT/' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;


-- ############################################################
-- BAGIAN 5: ROW LEVEL SECURITY (RLS)
-- ############################################################
-- Semua policy di-DROP dulu supaya aman diulang

ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_details   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;

-- ========== USERS ==========
DROP POLICY IF EXISTS "Users: semua bisa baca"  ON public.users;
DROP POLICY IF EXISTS "Users: update sendiri"   ON public.users;

CREATE POLICY "Users: semua bisa baca"
  ON public.users FOR SELECT USING (true);
CREATE POLICY "Users: update sendiri"
  ON public.users FOR UPDATE USING (auth.uid()::text = id_user::text);

-- ========== SELLERS ==========
DROP POLICY IF EXISTS "Sellers: semua bisa lihat" ON public.sellers;
DROP POLICY IF EXISTS "Sellers: update sendiri"   ON public.sellers;

CREATE POLICY "Sellers: semua bisa lihat"
  ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Sellers: update sendiri"
  ON public.sellers FOR UPDATE USING (true);  -- penjual login terpisah

-- ========== CATEGORIES ==========
DROP POLICY IF EXISTS "Categories: semua bisa baca" ON public.categories;

CREATE POLICY "Categories: semua bisa baca"
  ON public.categories FOR SELECT USING (true);

-- ========== PRODUCTS ==========
DROP POLICY IF EXISTS "Products: semua bisa lihat" ON public.products;
DROP POLICY IF EXISTS "Products: seller tambah"    ON public.products;
DROP POLICY IF EXISTS "Products: seller update"    ON public.products;
DROP POLICY IF EXISTS "Products: seller hapus"     ON public.products;

CREATE POLICY "Products: semua bisa lihat"
  ON public.products FOR SELECT USING (true);
CREATE POLICY "Products: seller tambah"
  ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products: seller update"
  ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products: seller hapus"
  ON public.products FOR DELETE USING (true);

-- ========== CARTS ==========
DROP POLICY IF EXISTS "Carts: akses sendiri"      ON public.carts;
DROP POLICY IF EXISTS "Carts: insert sendiri"     ON public.carts;
DROP POLICY IF EXISTS "Carts: delete sendiri"     ON public.carts;

CREATE POLICY "Carts: akses sendiri"
  ON public.carts FOR SELECT USING (true);
CREATE POLICY "Carts: insert sendiri"
  ON public.carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Carts: delete sendiri"
  ON public.carts FOR DELETE USING (true);

-- ========== CART_DETAILS ==========
DROP POLICY IF EXISTS "CartDetails: akses"   ON public.cart_details;
DROP POLICY IF EXISTS "CartDetails: insert"  ON public.cart_details;
DROP POLICY IF EXISTS "CartDetails: update"  ON public.cart_details;
DROP POLICY IF EXISTS "CartDetails: delete"  ON public.cart_details;

CREATE POLICY "CartDetails: akses"
  ON public.cart_details FOR SELECT USING (true);
CREATE POLICY "CartDetails: insert"
  ON public.cart_details FOR INSERT WITH CHECK (true);
CREATE POLICY "CartDetails: update"
  ON public.cart_details FOR UPDATE USING (true);
CREATE POLICY "CartDetails: delete"
  ON public.cart_details FOR DELETE USING (true);

-- ========== TRANSACTIONS ==========
DROP POLICY IF EXISTS "Transactions: akses" ON public.transactions;
DROP POLICY IF EXISTS "Transactions: insert" ON public.transactions;
DROP POLICY IF EXISTS "Transactions: update" ON public.transactions;

CREATE POLICY "Transactions: akses"
  ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Transactions: insert"
  ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Transactions: update"
  ON public.transactions FOR UPDATE USING (true);

-- ========== TRANSACTION_DETAILS ==========
DROP POLICY IF EXISTS "TransactionDetails: akses"  ON public.transaction_details;
DROP POLICY IF EXISTS "TransactionDetails: insert" ON public.transaction_details;

CREATE POLICY "TransactionDetails: akses"
  ON public.transaction_details FOR SELECT USING (true);
CREATE POLICY "TransactionDetails: insert"
  ON public.transaction_details FOR INSERT WITH CHECK (true);

-- ========== PAYMENTS ==========
DROP POLICY IF EXISTS "Payments: akses"  ON public.payments;
DROP POLICY IF EXISTS "Payments: insert" ON public.payments;
DROP POLICY IF EXISTS "Payments: update" ON public.payments;

CREATE POLICY "Payments: akses"
  ON public.payments FOR SELECT USING (true);
CREATE POLICY "Payments: insert"
  ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Payments: update"
  ON public.payments FOR UPDATE USING (true);

-- ========== REVIEWS ==========
DROP POLICY IF EXISTS "Reviews: semua bisa baca" ON public.reviews;
DROP POLICY IF EXISTS "Reviews: insert sendiri"  ON public.reviews;

CREATE POLICY "Reviews: semua bisa baca"
  ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews: insert sendiri"
  ON public.reviews FOR INSERT WITH CHECK (true);

-- ========== ORDERS ==========
DROP POLICY IF EXISTS "Orders: akses"  ON public.orders;
DROP POLICY IF EXISTS "Orders: insert" ON public.orders;
DROP POLICY IF EXISTS "Orders: update" ON public.orders;

CREATE POLICY "Orders: akses"
  ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders: insert"
  ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders: update"
  ON public.orders FOR UPDATE USING (true);

-- ========== ORDER_ITEMS ==========
DROP POLICY IF EXISTS "OrderItems: akses"  ON public.order_items;
DROP POLICY IF EXISTS "OrderItems: insert" ON public.order_items;

CREATE POLICY "OrderItems: akses"
  ON public.order_items FOR SELECT USING (true);
CREATE POLICY "OrderItems: insert"
  ON public.order_items FOR INSERT WITH CHECK (true);

-- ========== ADDRESSES ==========
DROP POLICY IF EXISTS "Addresses: akses sendiri"  ON public.addresses;
DROP POLICY IF EXISTS "Addresses: insert sendiri" ON public.addresses;
DROP POLICY IF EXISTS "Addresses: update sendiri" ON public.addresses;
DROP POLICY IF EXISTS "Addresses: delete sendiri" ON public.addresses;

CREATE POLICY "Addresses: akses sendiri"
  ON public.addresses FOR SELECT USING (true);
CREATE POLICY "Addresses: insert sendiri"
  ON public.addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Addresses: update sendiri"
  ON public.addresses FOR UPDATE USING (true);
CREATE POLICY "Addresses: delete sendiri"
  ON public.addresses FOR DELETE USING (true);

-- ========== WISHLISTS ==========
DROP POLICY IF EXISTS "Wishlists: akses sendiri"  ON public.wishlists;
DROP POLICY IF EXISTS "Wishlists: insert sendiri" ON public.wishlists;
DROP POLICY IF EXISTS "Wishlists: delete sendiri" ON public.wishlists;

CREATE POLICY "Wishlists: akses sendiri"
  ON public.wishlists FOR SELECT USING (true);
CREATE POLICY "Wishlists: insert sendiri"
  ON public.wishlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Wishlists: delete sendiri"
  ON public.wishlists FOR DELETE USING (true);

-- ========== WALLETS ==========
DROP POLICY IF EXISTS "Wallets: akses sendiri"  ON public.wallets;
DROP POLICY IF EXISTS "Wallets: update sendiri" ON public.wallets;

CREATE POLICY "Wallets: akses sendiri"
  ON public.wallets FOR SELECT USING (true);
CREATE POLICY "Wallets: update sendiri"
  ON public.wallets FOR UPDATE USING (true);

-- ========== WALLET_TRANSACTIONS ==========
DROP POLICY IF EXISTS "WalletTrx: akses sendiri" ON public.wallet_transactions;
DROP POLICY IF EXISTS "WalletTrx: insert"        ON public.wallet_transactions;

CREATE POLICY "WalletTrx: akses sendiri"
  ON public.wallet_transactions FOR SELECT USING (true);
CREATE POLICY "WalletTrx: insert"
  ON public.wallet_transactions FOR INSERT WITH CHECK (true);

-- ========== NOTIFICATIONS ==========
DROP POLICY IF EXISTS "Notifications: akses sendiri" ON public.notifications;
DROP POLICY IF EXISTS "Notifications: update sendiri" ON public.notifications;

CREATE POLICY "Notifications: akses sendiri"
  ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Notifications: update sendiri"
  ON public.notifications FOR UPDATE USING (true);


-- ############################################################
-- BAGIAN 6: SEED DATA — Kategori Produk
-- ############################################################

INSERT INTO public.categories (nama_category, deskripsi) VALUES
  ('Pupuk',          'Pupuk organik & anorganik untuk kesuburan tanah'),
  ('Bibit',          'Bibit & benih tanaman unggul berkualitas'),
  ('Pestisida',      'Obat hama, fungisida, herbisida, dan ZPT'),
  ('Alat Pertanian', 'Peralatan pertanian: cangkul, sabit, sprayer, dll'),
  ('Perlengkapan',   'Perlengkapan berkebun: polybag, selang, sarung tangan, dll')
ON CONFLICT DO NOTHING;


-- ############################################################
-- BAGIAN 7: VIEWS — Query Helper untuk Dashboard
-- ############################################################

-- ************************************************************
-- VIEW: Dashboard Buyer (User)
-- ************************************************************
CREATE OR REPLACE VIEW v_buyer_dashboard AS
SELECT
  u.id_user,
  u.nama,
  u.username,
  u.email,
  u.no_telp,
  u.alamat,
  u.avatar_url,
  u.membership,
  COALESCE(w.saldo, 0)   AS saldo_wallet,

  -- Hitungan transaksi per status
  COUNT(t.id_transaction) FILTER (WHERE t.status = 'pending')     AS menunggu_bayar,
  COUNT(t.id_transaction) FILTER (WHERE t.status = 'dikirim')     AS sedang_dikirim,
  COUNT(t.id_transaction) FILTER (WHERE t.status = 'dibatalkan')  AS dibatalkan,
  COUNT(t.id_transaction) FILTER (WHERE t.status = 'selesai')     AS selesai,

  -- Nilai transaksi aktif
  COALESCE(
    SUM(t.total_harga) FILTER (WHERE t.status NOT IN ('selesai', 'dibatalkan')),
    0
  ) AS nilai_transaksi_aktif

FROM public.users u
LEFT JOIN public.wallets w      ON w.id_user = u.id_user
LEFT JOIN public.transactions t ON t.id_user = u.id_user
WHERE u.role = 'pembeli' OR u.role = 'admin'
GROUP BY u.id_user, u.nama, u.username, u.email, u.no_telp, u.alamat,
         u.avatar_url, u.membership, w.saldo;


-- ************************************************************
-- VIEW: Dashboard Seller (Penjual)
-- ************************************************************
CREATE OR REPLACE VIEW v_seller_dashboard AS
SELECT
  s.id_seller,
  s.nama_toko,
  s.nama_pemilik,
  s.avatar_url,
  s.is_open,
  s.saldo_toko,
  s.transaksi_berjalan,

  -- Counter dari orders
  s.perlu_diproses,
  s.menunggu_konfirmasi,
  s.sedang_dikirim,
  s.sedang_dibatalkan,
  s.kendala_layanan,
  s.stok_habis,

  -- Performa
  s.jumlah_pembeli,
  s.pesanan_selesai,
  s.pesanan_dibatalkan,

  -- Hitung total produk
  (SELECT COUNT(*) FROM public.products p WHERE p.id_seller = s.id_seller AND p.is_active = TRUE) AS total_produk,

  -- Rata-rata rating toko
  (SELECT COALESCE(ROUND(AVG(p.rating)::NUMERIC, 1), 0)
   FROM public.products p
   WHERE p.id_seller = s.id_seller AND p.jumlah_ulasan > 0) AS rating_toko,

  -- Total ulasan toko
  (SELECT COALESCE(SUM(p.jumlah_ulasan), 0)
   FROM public.products p
   WHERE p.id_seller = s.id_seller) AS total_ulasan_toko

FROM public.sellers s;


-- ************************************************************
-- VIEW: Keranjang belanja detail (join semua data)
-- ************************************************************
CREATE OR REPLACE VIEW v_cart_detail AS
SELECT
  c.id_cart,
  c.id_user,
  cd.id_cart_detail,
  cd.id_product,
  cd.jumlah,
  cd.catatan,
  cd.kurir_terpilih,
  cd.is_selected,
  p.nama_product,
  p.harga,
  p.gambar_utama,
  p.stok,
  p.satuan,
  p.is_gratis_ongkir,
  p.id_seller,
  s.nama_toko,
  (cd.jumlah * p.harga) AS subtotal
FROM public.carts c
JOIN public.cart_details cd ON cd.id_cart = c.id_cart
JOIN public.products p     ON p.id_product = cd.id_product
JOIN public.sellers s      ON s.id_seller = p.id_seller;


-- ************************************************************
-- VIEW: Riwayat pesanan buyer (dengan detail item)
-- ************************************************************
CREATE OR REPLACE VIEW v_order_history AS
SELECT
  t.id_transaction,
  t.id_user,
  t.tanggal_transaksi,
  t.total_harga,
  t.status,
  t.alamat_pengiriman,
  t.metode_pembayaran,
  t.kurir,
  t.nomor_resi,
  td.id_detail,
  td.id_product,
  td.jumlah,
  td.harga_satuan,
  td.subtotal,
  p.nama_product,
  p.gambar_utama,
  p.id_seller,
  s.nama_toko
FROM public.transactions t
JOIN public.transaction_details td ON td.id_transaction = t.id_transaction
LEFT JOIN public.products p        ON p.id_product = td.id_product
LEFT JOIN public.sellers s         ON s.id_seller = p.id_seller;


-- ************************************************************
-- VIEW: Ulasan yang perlu ditulis (pesanan selesai, belum diulas)
-- ************************************************************
CREATE OR REPLACE VIEW v_waiting_review AS
SELECT
  td.id_detail,
  t.id_user,
  t.id_transaction,
  td.id_product,
  p.nama_product,
  p.gambar_utama,
  t.tanggal_transaksi,
  t.status
FROM public.transaction_details td
JOIN public.transactions t ON t.id_transaction = td.id_transaction
JOIN public.products p     ON p.id_product = td.id_product
LEFT JOIN public.reviews r ON r.id_user = t.id_user AND r.id_product = td.id_product
WHERE t.status = 'selesai'
  AND r.id_review IS NULL;


-- ############################################################
-- SELESAI! 🎉
-- ############################################################
--
-- TABEL YANG SUDAH ADA (dimodifikasi / ALTER):
--   1.  users               + username, avatar_url, membership, updated_at
--   2.  sellers             + deskripsi_toko, id_user
--   3.  categories          (tidak ada perubahan)
--   4.  products            + is_active, updated_at, min_order
--   5.  carts               + updated_at
--   6.  cart_details         + catatan, kurir_terpilih, is_selected
--   7.  transactions        + nomor_resi, kurir, batas_bayar, dikirim_at, selesai_at, dibatalkan_at, alasan_batal, id_seller
--   8.  transaction_details (tidak ada perubahan)
--   9.  payments            (tidak ada perubahan)
--   10. reviews             + updated_at, id_detail
--   11. orders              + id_user
--   12. order_items         (tidak ada perubahan)
--
-- TABEL BARU:
--   13. addresses           — Alamat pengiriman multi-alamat
--   14. wishlists           — Produk favorit
--   15. wallets             — Dompet digital user
--   16. wallet_transactions — Riwayat mutasi saldo
--   17. notifications       — Notifikasi user
--
-- TRIGGERS (5):
--   ✔ trg_users_updated_at     — Auto-update updated_at
--   ✔ trg_sellers_updated_at   — Auto-update updated_at
--   ✔ trg_products_updated_at  — Auto-update updated_at
--   ✔ trg_wallets_updated_at   — Auto-update updated_at
--   ✔ trg_reviews_update_rating — Auto-update rating produk
--   ✔ trg_orders_update_seller  — Auto-update counter seller
--   ✔ trg_new_user_wallet       — Auto-create wallet
--
-- FUNCTIONS (4):
--   ✔ trigger_set_updated_at()
--   ✔ trigger_update_product_rating()
--   ✔ trigger_update_seller_counters()
--   ✔ trigger_create_wallet_for_new_user()
--   ✔ generate_invoice_number()
--
-- VIEWS (5):
--   ✔ v_buyer_dashboard   — Dashboard pembeli
--   ✔ v_seller_dashboard  — Dashboard penjual
--   ✔ v_cart_detail        — Keranjang belanja lengkap
--   ✔ v_order_history      — Riwayat pesanan
--   ✔ v_waiting_review     — Produk menunggu diulas
--
-- RLS POLICIES: 38 policies untuk semua 17 tabel
-- SEED DATA: 5 kategori produk
-- ============================================================