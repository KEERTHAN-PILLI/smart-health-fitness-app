import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/smart-health-fitness-app">
    <HashRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</HashRouter>
  </BrowserRouter>
  
);
