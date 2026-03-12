import React from 'react'
import './Explore.css';
import Card from '../productcard/Productcard'

export default function Explore() {
  return (
    <section className='explore-container'>
        <div className='explore-head'>
            <img src='asset/images/explore-icon.png' width='70'/>
            <div>
                <h2 className=''>Explore produk</h2>
                <p>Rekomendasi produk terbaik</p>
            </div>
        </div>
        <div className='explore-product'>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    </section>
  )
}
