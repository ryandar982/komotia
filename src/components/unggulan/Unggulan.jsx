import './unggulan.css';

export default function Unggulan({}){
    const category = [
    { id: 1, name: "Pupuk Organik"},
    { id: 2, name: "Bibit Jagung"},
    { id: 3, name: "Pestisida Alami"},
    { id: 4, name: "Pestisida Organik"},
    ];
    return(
        <section className='cat-container'>
            <div className='cat-bar'>
                <div className='text'>
                    <h4>Kategori Unggulan Minggu Ini</h4>
                </div>
                <div className='best-cat'>
                    {category.map((category) => (
                    <div key={category.id} className="cat-card">
                    <div className='cat-gambar'> 
                        <p></p>
                    </div>
                    <h3>{category.name}</h3>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}