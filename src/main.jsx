import React from "react";
import ReactDOM from "react-dom/client";
import Hero from "./Hero";
import Features from "./Features";
import Partners from "./Partners";
import CTA from "./CTA";
import Contact from "./Contact";
import Footer from "./Footer";

import "./assets/tailkit.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Hero />
    <Features />
    <Partners />
    <CTA />
    <Contact />
    <Footer />
  </React.StrictMode>,
);
