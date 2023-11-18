// external imports
import React from "react";
import ReactDOM from "react-dom/client";
// redux imports
import { Provider } from "react-redux";
import store from "./store";

// theme customizer
import ThemeCustomizer from "./theme";

import App from "./App";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ThemeCustomizer>
      <App />
    </ThemeCustomizer>
  </Provider>
);
