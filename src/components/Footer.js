import React from 'react';
import logo from '../logo.png';

export default function Footer({ onScrollToTop }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logo} alt="Oruv Logo" className="footer-logo-img" />
          <span className="footer-title">Oruv Support</span>
        </div>
        <p className="footer-desc">
          Crafted with care to help every Oruv user have a seamless experience.
        </p>
        <div className="footer-bottom">
          <span>&copy; {currentYear} Oruv. All rights reserved.</span>
          <button type="button" onClick={onScrollToTop} className="footer-back-to-top">
            Back to Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
