import React from 'react'
import { useState } from 'react';
import NavDashboard from '../components/navbar/NavDashboard';
import SellerLogin from '../components/sellerlogin/sellerLogin';

const SellerLoginPage = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <NavDashboard/>
        <SellerLogin/>
    </>
    );
}

export default SellerLoginPage