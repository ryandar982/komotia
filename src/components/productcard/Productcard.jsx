// File: src/components/productcard/Productcard.js

import './Productcard.css'
import { useEffect, useRef } from "react"
import fitty from "fitty"

export default function Productcard({ product }) {
    const textRef = useRef(null)

    useEffect(() => {
        if (textRef.current) {
            fitty(textRef.current)
        }
    }, [])

    return (
        <div className="product-display">
            <img className='product-image' src={product.image.startsWith('/') ? product.image : `/${product.image}`} alt={product.name} />
            <div className='product-info'>
                <div className='product-left'>
                    <h1 ref={textRef}>
                        {product.name}
                    </h1>
                    <h2>Rp {product.price.toLocaleString('id-ID')}</h2>

                    <div className="product-rate">
                        <img
                            src="/asset/images/star-yes-rate.png"  
                            className="star-icon"
                            alt="rating"
                        />
                        <p>{product.ratingText}</p>
                    </div>
                </div>

                <div className='product-right'>
                    <img className='images-container' src="/asset/images/free-dev.png" height="25" alt="free delivery" />  {/* ✅ tambah / */}

                    <a className="add-cart" href="#cart">
                        <img className="add-cart" src="/asset/images/add-cart.png" alt="add to cart" />  {/* ✅ tambah / */}
                        <span className="tooltip">Tambah ke Keranjang</span>
                    </a>
                </div>
            </div>
        </div>
    )
}