import './Kolektif.css';

export default function Kolektif({}) {
    return (
        <section className='kolektif-container'>
            <div className='kolektif-text'>
                <img src='asset/images/kolektif-icon.png' height='80'/>
                <h2>Pembelian Kolektif</h2>
                <p>Hemat hingga 15% dengan sistem pembelian kolektif</p>
            </div>
            <div className='kolektif-content'>
                <div className='kolektif-choice'>
                    ini gambar
                </div>
                <div className='kolektif-choice'>
                    ini gambar
                </div>
            </div>
        </section>
    );
}