import React from 'react'
import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import Registerform from '../components/authreg/registerform';

const Register = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Registerform/>
    </>
    );
}

export default Register