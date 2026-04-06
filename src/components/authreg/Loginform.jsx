import { Link } from 'react-router';
import './authreg.css';
import React, { useState } from "react";
import { loginWithGoogle } from "../../firebase/auth.js";


export default function Loginform() {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Masukkan akun anda</h2>

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

        <button type="submit">
          Masuk
        </button>

        <div className="divider">
          <span>atau</span>
        </div>

        <Link to="/login">
          <div className="option-google" onClick={loginWithGoogle}>
            <img src="asset/images/google-logo.png" width="35" />
            <p>Login dengan Google</p>
          </div>
        </Link>
      </form>
    </div>
  );
}