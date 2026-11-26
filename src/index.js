import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";

import App from "./App";
import theme from "./theme";
import { AppProvider } from "./contexts/AppContext";

import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <App />
        <ToastContainer position="top-right" />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);
