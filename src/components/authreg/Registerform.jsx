import { Link } from 'react-router';
import './authreg.css';
import React, { useState } from "react";


export default function Registerform({}) {
    const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(form.password !== form.confirmPassword){
      alert("Password tidak sama");
      return;
    }

    console.log(form);
  };

return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Buat akun anda sekarang</h2>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <label>Konfirmasi Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Konfirmasi Password"
          onChange={handleChange}
        />
        <button type="submit">
          Daftar Sekarang
        </button>
        <div className='option-login'>
            <p>Sudah mempunyai akun?</p>
            <Link to="/login">
            <p>masuk</p>
            </Link>
        </div>
        <div className="divider">
            <span>atau</span>
        </div>
        <Link to=''>
        <div className='option-google'>
            <img src='asset/images/google-logo.png' width='35'/>
            <p>Login dengan Google</p>
        </div>
        </Link>
      </form>

    </div>
);
}