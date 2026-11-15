import React from 'react';
import logo from '../logo.png';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <img src={logo} alt="Oruv Logo" className="brand-logo-img" />
          <span className="brand-name">Oruv</span>
          <span className="brand-tag">Support</span>
        </div>
      </div>
    </header>
  );
}
