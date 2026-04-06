import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'
import Product from './pages/Product'
import SellerDashboard from './pages/SellerDashboard'
import UserDashboard from './pages/UserDashboard'

const Router = () => {
  return (
    <Routes>
        <Route index element={<Home />} /> 
        <Route path='about' element={<About />} />
        <Route path='cart' element={<Cart />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />}/>
        <Route path='product' element={<Product />}/>
        <Route path='seller-dashboard' element={<SellerDashboard />}/>
        <Route path='user-dashboard' element={<UserDashboard/>}/>
    </Routes>
  )
}

export default Router