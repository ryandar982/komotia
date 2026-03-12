import React from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Cart from './pages/Cart'
import Register from './pages/Register'
import Login from './pages/Login'

const Router = () => {
  return (
    <Routes>
        <Route index element={<Home />} /> 
        <Route path='about' element={<About />} />
        <Route path='cart' element={<Cart />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />}/>
    </Routes>
  )
}

export default Router