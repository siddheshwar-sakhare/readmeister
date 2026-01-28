import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SignIn from "./auth/SignIn.jsx";
import Home from "./pages/Home.jsx";

import "./index.css"; // Tailwind CSS
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile"  element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
