import './Productcard.css'
import { useEffect, useRef } from "react"
import fitty from "fitty"

export default function Productcard({ product }) {
    const textRef = useRef(null)

    // Simpan base URL Vite ke variabel agar kode lebih rapi
    const baseUrl = import.meta.env.BASE_URL;

    useEffect(() => {
        if (textRef.current) {
            fitty(textRef.current)
        }
    }, [])

    // Membersihkan garis miring di awal (jika ada) dari database/API
    // Agar tidak terjadi double slash seperti /komotia//images/...
    const cleanProductImage = product.image.startsWith('/') 
        ? product.image.slice(1) 
        : product.image;

    return (
        <div className="product-display">
            {/* Pakai baseUrl untuk gambar dinamis */}
            <img className='product-image' src={`${baseUrl}${cleanProductImage}`} alt={product.name} />
            
            <div className='product-info'>
                <div className='product-left'>
                    <h1 ref={textRef}>
                        {product.name}
                    </h1>
                    <h2>Rp {product.price.toLocaleString('id-ID')}</h2>

                    <div className="product-rate">
                        {/* Pakai baseUrl untuk gambar statis */}
                        <img
                            src={`${baseUrl}asset/images/star-yes-rate.png`}  
                            className="star-icon"
                            alt="rating"
                        />
                        <p>{product.ratingText}</p>
                    </div>
                </div>

                <div className='product-right'>
                    <img className='images-container' src={`${baseUrl}asset/images/free-dev.png`} height="25" alt="free delivery" /> 

                    <a className="add-cart" href="#cart">
                        <img className="add-cart" src={`${baseUrl}asset/images/add-cart.png`} alt="add to cart" /> 
                        <span className="tooltip">Tambah ke Keranjang</span>
                    </a>
                </div>
            </div>
        </div>
    )
}