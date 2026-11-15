import React from 'react';
import Navbar from './components/Navbar';
import SupportForm from './components/SupportForm';
import Footer from './components/Footer';
import './App.css';

function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <SupportForm />
      </main>

      <Footer onScrollToTop={scrollToTop} />
    </div>
  );
}

export default App;
