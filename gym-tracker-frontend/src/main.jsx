import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Import del componente principale
import "./index.css"; // Import degli stili globali / Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
