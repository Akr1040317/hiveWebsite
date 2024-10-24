import React from "react";
import ReactDOM from "react-dom/client";
import Hero from "./Hero";
import Features from "./Features";
import Partners from "./Partners";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "./Footer";
import PrivacyPolicy from "./privacyPolicy/page"; // Import the PrivacyPolicy component
import LoginPage from "./LoginPage"; // Import the LoginPage component
import SignupPage from "./SignupPage"; // Import the SignupPage component
import Dashboard from "./Dashboard"; // Import the Dashboard component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes and Route

import "./assets/tailkit.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={
        <>
          <Hero />
          <Features />
          <Partners />
          <CTA />
          <Contact />
          <Footer />
        </>
      } />
      <Route path="/login" element={<LoginPage />} /> {/* Add Login Page Route */}
      <Route path="/signup" element={<SignupPage />} /> {/* Add Signup Page Route */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard Page Route */}
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
    </Routes>
  </Router>,
);
