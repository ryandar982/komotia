import React from 'react'
import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Registerform from '../components/authreg/Registerform';
import Footer from '../components/footer/Footer';

const Register = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Registerform/>
        <Footer/>
    </>
    );
}

export default Register