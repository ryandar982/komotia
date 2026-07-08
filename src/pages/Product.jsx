import Navbar from '../components/navbar/Navbar';
import Productpage from '../components/productpage/Productpage';
import { useState } from 'react';
import Footer from '../components/footer/Footer';

const Product = () => {
  const [search, setSearch] = useState("");
  return (
    <>
        <Navbar search={search} setSearch={setSearch}/>
        <Productpage/>
        <Footer/>
    </>
  )
}

export default Product