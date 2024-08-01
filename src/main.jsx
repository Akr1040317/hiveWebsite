import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Partners from './Partners';
import CTA from './CTA';
import Contact from './Contact';
import Footer from './Footer';
import PrivacyPolicy from './privacyPolicy/page'; // Import the PrivacyPolicy component

import './assets/tailkit.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Switch>
      <Route exact path="/" component={Hero} />
      <Route path="/features" component={Features} />
      <Route path="/partners" component={Partners} />
      <Route path="/cta" component={CTA} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} /> {/* Correct route */}
      <Footer />
    </Switch>
  </Router>
);
