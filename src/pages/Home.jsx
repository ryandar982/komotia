import React from 'react'
import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Hero from '../components/hero/Hero';
import Unggulan from '../components/unggulan/Unggulan';
import Kolektif from '../components/kolektif/Kolektif';
import Ongkiroffer from '../components/ongkir/Ongkiroffer';
import PromoBanner from '../components/promobanner/PromoBanner';
import Explore from '../components/moreproduct/Explore';
import Footer from '../components/footer/Footer';

const Home = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Hero />
        <Unggulan/>
        <Kolektif/>
        <PromoBanner />
        <Ongkiroffer/>
        <Explore/>
        <Footer/>
    </>
    );
}

export default Home