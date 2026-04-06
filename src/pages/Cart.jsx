import React from 'react';
import Navbar from '../components/navbar/Navbar';
import CartComp from '../components/cartcomponent/CartMain'
import { useState } from 'react';

const Cart = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar search={search} setSearch={setSearch}/>
      <CartComp/>
      
    </>
  )
}

export default Cart