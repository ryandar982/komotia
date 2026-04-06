import React from 'react';
import Navbar from '../components/navbar/Navbar';
import Productpage from '../components/productpage/productpage';
import { useState } from 'react';

const Product = () => {
  const [search, setSearch] = useState("");
  return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Productpage/>
    </>
  )
}

export default Product