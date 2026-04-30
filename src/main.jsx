import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- PENTING: Gunakan react-router-dom
import App from "./app";
import './index.css'
import Router from "./router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Router />
  </BrowserRouter>,
);