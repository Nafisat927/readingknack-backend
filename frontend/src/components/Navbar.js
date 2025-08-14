import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#fff',
      borderBottom: '2px solid var(--rk-blue)',
      padding: '0.5rem 0',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2rem',
      maxWidth: 1200,
      margin: '0 auto 2rem auto',

    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: 24 }}>
          <img src="/logo.png" alt="ReadingKnack Logo" style={{ height: 40, marginRight: 12 }} />
          <span style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 900,
            fontSize: '1.5rem',
            background: 'linear-gradient(90deg, var(--rk-pink), var(--rk-purple), var(--rk-blue))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block',
            letterSpacing: '-1px',
          }}>
            ReadingKnack
          </span>
          <span style={{ color: 'var(--rk-dark)', fontWeight: 700, fontSize: '1.5rem', marginLeft: 2 }}>.com</span>
        </Link>
        <Link to="/upload" className="btn" style={{ marginRight: 8 }}>Upload</Link>
        <Link to="/documents" className="btn" style={{ marginRight: 8 }}>Documents</Link>
        <Link to="/quiz" className="btn" style={{ marginRight: 8 }}>Quiz</Link>
        <Link to="/profile" className="btn">Profile</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/login" className="btn">Log In</Link>
        <Link to="/signup" className="btn">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 