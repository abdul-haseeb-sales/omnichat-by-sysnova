import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import '../css/LandingNavbar.css';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`landing-nav ${isScrolled ? 'landing-nav--scrolled' : ''}`}>
      <div className="container landing-nav-container">
        <Link to="/" className="landing-logo">
          <div className="landing-logo-icon">
            <MessageCircle size={24} strokeWidth={2.5} />
          </div>
          <span className="landing-logo-text">OmniChat</span>
        </Link>

        <div className="landing-links hide-mobile">
          <a href="#features" className="landing-link">Features</a>
          <a href="#how-it-works" className="landing-link">How It Works</a>
          <a href="#faq" className="landing-link">FAQ</a>
        </div>

        <div className="landing-actions hide-mobile">
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>

        <button className="mobile-menu-btn hide-desktop" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <a href="#features" className="mobile-link" onClick={toggleMobileMenu}>Features</a>
            <a href="#how-it-works" className="mobile-link" onClick={toggleMobileMenu}>How It Works</a>
            <a href="#faq" className="mobile-link" onClick={toggleMobileMenu}>FAQ</a>
            <div className="mobile-actions">
              <Link to="/login" className="btn btn-secondary w-full" onClick={toggleMobileMenu}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary w-full" onClick={toggleMobileMenu}>Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
