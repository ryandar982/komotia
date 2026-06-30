import React from 'react'
import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import StorePage from '../components/storepage/StorePage';
import Footer from '../components/footer/Footer';

const Store = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <StorePage />
        <Footer/>
    </>
    );
}

export default Store
