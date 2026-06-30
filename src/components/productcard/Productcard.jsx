import './Productcard.css'
import { useRef } from "react"

export default function Productcard({ product }) {
    const textRef = useRef(null)
    const baseUrl = import.meta.env.BASE_URL;

    // Pemetaan kolom sesuai tabel Supabase yang baru
    const namaProduk = product?.nama_product || "Produk Tanpa Nama";
    const hargaProduk = product?.harga || product?.price || 0;
    const gambarRaw = product?.gambar_utama || "";
    const rating = product?.rating || "0";
    const jumlahUlasan = product?.jumlah_ulasan || "0";
    const ratingText = `${rating} (${jumlahUlasan})`;
    const isGratisOngkir = product?.is_gratis_ongkir || false;

    // Early return setelah semua hooks
    if (!product) return null;

    // Tentukan src gambar: jika URL penuh (http) langsung pakai, jika path lokal pakai baseUrl
    const srcGambarFinal = gambarRaw
        ? (gambarRaw.startsWith('http') 
            ? gambarRaw 
            : `${baseUrl}${gambarRaw.startsWith('/') ? gambarRaw.slice(1) : gambarRaw}`)
        : `${baseUrl}asset/images/free-dev.png`;

    return (
        <div className="product-display">
            <img className='product-image' src={srcGambarFinal} alt={namaProduk} />
            
            <div className='product-info'>
                <div className='product-left'>
                    <h1 ref={textRef}>
                        {namaProduk}
                    </h1>
                    <h2>Rp {Number(hargaProduk).toLocaleString('id-ID')}</h2>

                    <div className="product-rate">
                        <img
                            src={`${baseUrl}asset/images/star-yes-rate.png`}  
                            className="star-icon"
                            alt="rating"
                        />
                        <p>{ratingText}</p>
                    </div>
                </div>

                <div className='product-right'>
                    {/* Tampilkan ikon gratis ongkir jika is_gratis_ongkir true */}
                    {isGratisOngkir && (
                        <img className='images-container' src={`${baseUrl}asset/images/free-dev.png`} height="25" alt="free delivery" /> 
                    )}

                    <button 
                        type="button"
                        className="add-cart" 
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Tambah ke keranjang, ID produk:", product.id_product);
                        }}
                    >
                        <img className="add-cart" src={`${baseUrl}asset/images/add-cart.png`} alt="add to cart" /> 
                        <span className="tooltip">Tambah ke Keranjang</span>
                    </button>
                </div>
            </div>
        </div>
    )
}