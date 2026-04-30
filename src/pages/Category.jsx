import React from 'react';
import Navbar from '../components/navbar/Navbar';
// UBAH: Import menggunakan nama kapital
import CategoryDisplay from '../components/categorydisplay/categoryDisplay';
import { useState } from 'react';

const Category = () => {
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar search={search} setSearch={setSearch}/>
      {/* UBAH: Panggil dengan huruf Kapital */}
      <CategoryDisplay />
    </>
  )
}

export default Category;