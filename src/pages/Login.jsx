import React from 'react'
import { useState } from 'react';
import Navbar from '../components/navbar/Navbar';;
import Loginform from '../components/authreg/Loginform';;

const Login = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Loginform/>
    </>
    );
}

export default Login