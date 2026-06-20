import { Link } from 'react-router-dom';
import { MessageCircle, Twitter, Github, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <MessageCircle size={18} />
              </div>
              <div className="footer-logo-text">
                Omni<span>Chat</span>
              </div>
            </Link>
            <p className="footer-description">
              The open-source omnichannel messaging platform. Connect all your
              conversations in one beautiful inbox — free forever.
            </p>
            <div className="footer-socials">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:support@omnichat.sysnova.com"
                className="footer-social-link"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="footer-column">
            <h4>Product</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Unified Inbox</Link>
              <Link to="/" className="footer-link">Channels</Link>
              <Link to="/" className="footer-link">AI Responses</Link>
              <Link to="/" className="footer-link">Team Chat</Link>
            </div>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4>Resources</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API Reference</a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
              <a href="#" className="footer-link">Blog</a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4>Contact</h4>
            <div className="footer-links">
              <a
                href="mailto:support@omnichat.sysnova.com"
                className="footer-link"
              >
                <Mail size={14} />
                support@omnichat.sysnova.com
              </a>
              <div className="open-source-badge">
                <span className="open-source-badge-dot" />
                Open Source
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            © 2026 OmniChat by <span>Sysnova</span>. Open source & free forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
