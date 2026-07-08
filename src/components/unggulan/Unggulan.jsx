// File: src/components/unggulan/Unggulan.jsx
import './Unggulan.css';

export default function Unggulan({}){
    // 1. Perbarui data category dengan menambahkan path gambar yang absolut (pakai /)
    const category = [
        { id: 1, name: "Pupuk", image: "/asset/images/kategori-pupuk.jpeg" },
        { id: 2, name: "Bibit", image: "/asset/images/item/8.jpg" },
        { id: 3, name: "Pestisida Alami", image: "/asset/images/item/9.jpg" },
        { id: 4, name: "Pestisida Organik", image: "/asset/images/item/10.jpg" },
    ];

    return(
        <section className='cat-container'>
            <div className='cat-bar'>
                <div className='text'>
                    <h4>Kategori Unggulan Minggu Ini</h4>
                </div>
                <div className='best-cat'>
                    {category.map((cat) => (
                    <div key={cat.id} className="cat-card">
                        <div className='cat-gambar'> 
                        {/* Gambar sekarang menggunakan class khusus untuk kontrol ukuran */}
                        <img src={cat.image} alt={cat.name} className="cat-img-fluid" />
                        </div>
                        <h3>{cat.name}</h3>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}