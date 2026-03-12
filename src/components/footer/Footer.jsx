import React from 'react'
import './Footer.css';

export default function Footer() {
  return (
    <div className='footer-container'>
        <section className=''>
            <img src='asset/images/komotia.png' width='130'/>
            <p>Platform terpercaya untuk melacak dan<br/>
            mengelola pesanan online Anda dengan <br/>
            mudah.</p>
        </section>
        <section>
            <h2>Perusahaan</h2>
            <div className='footer-div'>
                <a src=''>Tentang Kami</a>
                <a src=''>Karir</a>
                <a src=''>Blog</a>
                <a src=''>Kontak</a>
            </div>
        </section>
        <section>
            <h2>Bantuan</h2>
            <div className='footer-div'>
                <a src=''>Pusat Bantuan</a>
                <a src=''>Kebijakan Privasi</a>
                <a src=''>Syarat & Ketentuan</a>
                <a src=''>Pengembalian</a>
            </div>
        </section>
        <section>
            <h2>Ikuti Kami</h2>
            <div className='media-sosial'>
                <div classname='media-container'>
                    <img src='asset/images/instagram.png' width='45'/>
                    <img src='asset/images/facebook.png' width='45'/>
                    <img src='asset/images/twitter.png' width='45'/>
                </div>
            </div>
        </section>
    </div>
  )
}
