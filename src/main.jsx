
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app";
import './index.css'
import Router from "./router";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
);
