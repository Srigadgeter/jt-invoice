import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Theme Customizer
import ThemeCustomizer from "./theme";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeCustomizer>
    <App />
  </ThemeCustomizer>
);
