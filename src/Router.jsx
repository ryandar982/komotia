import React from 'react'
import { Route, Routes } from 'react-router-dom' // Lebih disarankan pakai react-router-dom
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import Product from './pages/Product'
import SellerDashboard from './pages/SellerDashboard'
import UserDashboard from './pages/UserDashboard'
import Category from './pages/Category'
import SellerLoginPage from './pages/SellerLoginPage'
const Router = () => {
  return (
    <Routes>
        <Route index element={<Home />} /> 
        <Route path='about' element={<About />} />
        <Route path='cart' element={<Cart />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />}/>
        
        {/* Rute untuk halaman utama produk (Katalog) jika kamu punya */}
        <Route path='product' element={<Product />}/>

        {/* INI YANG BARU: Rute dinamis untuk detail produk berdasarkan ID */}
        <Route path='product/:id' element={<Product />}/>
        
        <Route path='seller-dashboard' element={<SellerDashboard />}/>
        <Route path='user-dashboard' element={<UserDashboard/>}/>
        <Route path='category/:categoryName' element={<Category />} />
        <Route path='seller-login' element={<SellerLoginPage />} />
    </Routes>
  )
}

export default Router