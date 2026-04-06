import './Productcard.css'
import { useEffect, useRef } from "react"
import fitty from "fitty"


export default function Productcard({}){
    const textRef = useRef(null)

    useEffect(() => {
        fitty(textRef.current)
    }, [])

    return (
        <div className="product-display">
            <img className='product-image'src='asset/images/item1.jpg' height='200'/>
            <div className='product-info'>
                <div className='product-left'>
                    <h1 ref={textRef}>
                        Pupuk Organik Berkualitas | Bang Doel Shop
                    </h1>
                    <h2>Rp 51.000</h2>
                    <div className="product-rate">
                        <img 
                        src="asset/images/star-yes-rate.png" 
                        className="star-icon"
                        />
                        <p>Tidak ada ulasan</p>
                    </div>
                </div>
                <div className='product-right'>
                    <img className='images-container'src="asset/images/free-dev.png" height="25"/>
                    <a className="add-cart"href="">
                        <img className="add-cart" src="asset/images/add-cart.png"/>
                        <span className="tooltip">Tambah ke Keranjang</span>
                    </a>
                </div>
            </div>
        </div>
    )
}