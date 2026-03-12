import './Hero.css';
import { useState, useEffect } from "react";

import banner1 from "/asset/images/landscape1.jpg";
import banner2 from "/asset/images/landscape2.jpg";
import banner3 from "/asset/images/landscape3.jpg";

export default function Hero({}) {
  const images = [banner1, banner2, banner3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // 3 detik

    return () => clearInterval(interval);
  }, []);

return (
        <section className="banner-komotia" style={{ backgroundImage: `url(${images[index]})` }}>
          <div>
            <h1>Tingkatkan Produktivitas Pertanian Anda Hari ini</h1>
            <p>Dapatkan kebutuhan pertanian dalam satu platform digital</p>
          </div>
          <div className="slide-container">
            <button className="slide-button">
            </button>
            <button className="slide-button">
            </button>
            <button className="slide-button">
            </button>
          </div>
        </section>
);
}