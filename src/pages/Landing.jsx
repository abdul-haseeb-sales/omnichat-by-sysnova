import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Inbox, Zap, Users, Clock, Github, UserPlus, Link2, Send, ChevronDown } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import '../css/landing.css';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const faqs = [
    {
      q: 'What is OmniChat by Sysnova?',
      a: 'OmniChat is a unified omnichannel inbox platform that connects WhatsApp Business, Facebook Messenger, Instagram DMs, and Threads into a single shared workspace for customer support teams.'
    },
    {
      q: 'How do I get started?',
      a: 'Create a free account. Connect your first channel (WhatsApp, Facebook, etc.) from the settings screen. The entire setup takes under 5 minutes for most businesses.'
    },
    {
      q: 'What channels are supported?',
      a: 'OmniChat currently supports four major channels: WhatsApp Business API, Facebook Messenger, Instagram Direct Messages, and Threads. All four appear in one unified inbox.'
    },
    {
      q: 'Is it really free?',
      a: 'Yes. OmniChat by Sysnova is 100% free and open-source. There are no pricing tiers, no paywalls, and no credit card required to sign up.'
    },
    {
      q: 'Is my data secure?',
      a: 'Your data is secured by Supabase (PostgreSQL), utilizing row-level security and enterprise-grade encryption. We do not sell your data.'
    },
    {
      q: 'Can I self-host OmniChat?',
      a: 'Yes! The codebase is completely open-source. You can clone the repository from GitHub, configure your own Supabase backend, and deploy it on your own infrastructure.'
    }
  ];

  return (
    <div className="landing-wrapper">
      <LandingNavbar />

      <main>
        {/* ── Hero Section ── */}
        <section className="hero">
          <div className="hero-bg">
            <div className="hero-blob hero-blob--1" />
            <div className="hero-blob hero-blob--2" />
          </div>

          <div className="container hero-content animate-fade-in-up">
            <div className="hero-platforms delay-1">
              <div className="hero-platform-icon facebook"><MessageCircle size={20} /></div>
              <div className="hero-platform-icon instagram"><MessageCircle size={20} /></div>
              <div className="hero-platform-icon threads"><MessageCircle size={20} /></div>
              <div className="hero-platform-icon whatsapp"><MessageCircle size={20} /></div>
            </div>

            <h1 className="hero-title delay-2">
              <span>One Inbox.</span>
              <span className="text-gradient">All Your Channels.</span>
            </h1>

            <p className="hero-subtitle delay-3">
              Connect Facebook, Instagram, Threads & WhatsApp in one free workspace. 
              Stop switching between apps and start responding faster.
            </p>

            <div className="hero-actions delay-4">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <div className="stats-bar container animate-fade-in delay-5">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">4</span>
              <span className="stat-label">Channels</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">∞</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5m</span>
              <span className="stat-label">Setup Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value text-gradient">100%</span>
              <span className="stat-label">Free</span>
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <section id="features" className="section container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Everything you need</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Powerful features to help you provide exceptional customer support across all channels, without the enterprise price tag.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><MessageCircle size={28} /></div>
              <h3 className="feature-title">Omnichannel Support</h3>
              <p className="feature-desc">Connect with customers on Facebook, WhatsApp, Instagram, and Threads from one platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Inbox size={28} /></div>
              <h3 className="feature-title">Unified Inbox</h3>
              <p className="feature-desc">Stop switching tabs. Every message from every platform routes to a single, real-time feed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Zap size={28} /></div>
              <h3 className="feature-title">Real-Time Chat</h3>
              <p className="feature-desc">Instant message delivery, live typing indicators, and read receipts across all channels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users size={28} /></div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-desc">Add unlimited agents and assign incoming messages to the right team members instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Clock size={28} /></div>
              <h3 className="feature-title">Full History</h3>
              <p className="feature-desc">Never lose context. Complete conversation history is preserved forever in your database.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Github size={28} /></div>
              <h3 className="feature-title">Open Source</h3>
              <p className="feature-desc">100% free and open-source. Use our hosted version or deploy it on your own infrastructure.</p>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="section container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Live in 3 steps</h2>
            <p className="text-muted text-lg">No developer required. No credit card needed.</p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number"><UserPlus size={32} /></div>
              <h3 className="step-title">1. Sign up free</h3>
              <p className="step-desc">Create your free account with just an email and password.</p>
            </div>
            <div className="step-card">
              <div className="step-number"><Link2 size={32} /></div>
              <h3 className="step-title">2. Connect channels</h3>
              <p className="step-desc">Link your WhatsApp, Facebook, Instagram, and Threads accounts in one click.</p>
            </div>
            <div className="step-card">
              <div className="step-number"><Send size={32} /></div>
              <h3 className="step-title">3. Start chatting</h3>
              <p className="step-desc">Reply to all your customers from one beautiful, unified inbox.</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="section container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'is-open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.q}
                  <ChevronDown size={20} className="faq-icon" />
                </button>
                <div className="faq-answer">
                  <p className="pb-6">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section container">
          <div className="cta-banner">
            <h2 className="cta-title">Stop switching apps.<br />Start free today.</h2>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
