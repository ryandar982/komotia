import './Ongkiroffer.css';
import Card from '../productcard/Productcard';
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Ongkiroffer() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchGratisOngkir() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_gratis_ongkir', true);

                if (error) throw error;

                // Acak urutan produk
                const shuffled = (data || []).sort(() => 0.5 - Math.random());
                setProducts(shuffled);
            } catch (err) {
                console.error('Error fetching gratis ongkir products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchGratisOngkir();
    }, []);

    // Cek apakah bisa scroll kiri/kanan
    const checkScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    useEffect(() => {
        checkScrollButtons();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScrollButtons);
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [products]);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 220; // lebar ~1 card
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="offer-container">
            <div className="ongkir-wrapper">
                {/* Tombol Panah Kiri */}
                {canScrollLeft && (
                    <button className="ongkir-arrow ongkir-arrow-left" onClick={() => scroll('left')}>
                        <ChevronLeft size={22} />
                    </button>
                )}

                <div className="list-container" ref={scrollRef}>
                    
                    {/* Banner Gratis Ongkir */}
                    <div className="freeong-banner">
                        <img src="asset/images/free-dev.png" width="70" alt="Gratis Ongkir"/>
                        <h1>Gratis Ongkir</h1>
                        <p>Lebih hemat<br/>dengan promo<br/> gratis ongkir</p>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#888' }}>
                            Memuat produk...
                        </div>
                    )}

                    {/* Product cards dari database */}
                    {!loading && products.map((item) => (
                        <Link 
                            className='product-link' 
                            to={`/product/${item.id_product}`} 
                            key={item.id_product}
                        >
                            <div className='col'>
                                <Card product={item} />
                            </div>
                        </Link>
                    ))}

                    {/* Empty state */}
                    {!loading && products.length === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#888' }}>
                            Belum ada produk gratis ongkir.
                        </div>
                    )}

                </div>

                {/* Tombol Panah Kanan */}
                {canScrollRight && (
                    <button className="ongkir-arrow ongkir-arrow-right" onClick={() => scroll('right')}>
                        <ChevronRight size={22} />
                    </button>
                )}
            </div>
        </div>
    )
}