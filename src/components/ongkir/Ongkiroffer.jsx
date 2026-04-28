import './Ongkiroffer.css';
import Card from '../productcard/Productcard'
import { Link } from "react-router-dom";
import { dummyProducts } from '../../data/dummyProducts';
import { useState, useEffect } from 'react'; // 1. Import useState dan useEffect

export default function Ongkiroffer() {
    // 2. Buat state untuk menyimpan 4 produk acak
    const [randomProducts, setRandomProducts] = useState([]);

    // 3. Gunakan useEffect untuk mengacak data hanya sekali saat komponen pertama kali dimuat
    useEffect(() => {
        // Menggandakan array agar tidak mengubah data aslinya
        const shuffled = [...dummyProducts].sort(() => 0.5 - Math.random());
        
        // Mengambil 4 item pertama dari array yang sudah diacak
        const selected = shuffled.slice(0, 4);
        
        // Simpan ke dalam state
        setRandomProducts(selected);
    }, []); // Array kosong [] memastikan ini hanya berjalan satu kali

    return (
        <div className="offer-container">
            <div className="list-container">
                
                {/* Banner Gratis Ongkir */}
                <div className="freeong-banner">
                    <img src="asset/images/free-dev.png" width="70" alt="Gratis Ongkir"/>
                    <h1>Gratis Ongkir</h1>
                    <p>Lebih hemat<br/>dengan promo<br/> gratis ongkir</p>
                </div>

                {/* 4. Looping menggunakan state randomProducts, BUKAN dummyProducts lagi */}
                {randomProducts.map((item) => (
                    <Link 
                        className='product-link' 
                        to={`/product/${item.id}`} 
                        key={item.id}
                    >
                        <div className='col'>
                            <Card product={item} />
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    )
}