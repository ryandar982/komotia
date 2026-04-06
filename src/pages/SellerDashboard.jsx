import React from 'react'
import { useState } from 'react';
import NavDashboard from '../components/navbar/NavDashboard';
import SellerDash from '../components/sellerdashboard/SellerMain';

const SellerDashboard = () => {
    const [search, setSearch] = useState("");
    return (
    <>
        <NavDashboard/>
        <SellerDash/>
    </>
    );
}

export default SellerDashboard