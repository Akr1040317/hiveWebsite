import React from "react";
import ReactDOM from "react-dom/client";
import Hero from "./Hero";
import Features from "./Features";
import Partners from "./Partners";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "./Footer";
import PrivacyPolicy from "./privacyPolicy/page"; // Import the PrivacyPolicy component
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
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
    </Routes>
  </Router>,
);
