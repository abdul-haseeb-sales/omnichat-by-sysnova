import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setApiError(error.message || 'Failed to create account.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-orb auth-orb--3" />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <MessageCircle size={28} strokeWidth={2.2} />
          </div>
          <div className="auth-logo-text">
            <h1>OmniChat</h1>
            <p>Create your free account</p>
          </div>
        </div>

        {apiError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert-icon">⚠</span>
            <span>{apiError}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-input-wrapper">
            <label htmlFor="fullName">Full Name</label>
            <div className="auth-input-container">
              <User size={18} className="auth-input-icon" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`auth-input ${errors.fullName ? 'auth-input--error' : ''}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                autoFocus
              />
            </div>
            {errors.fullName && <span className="auth-field-error">{errors.fullName}</span>}
          </div>

          <div className="auth-input-wrapper">
            <label htmlFor="email">Email Address</label>
            <div className="auth-input-container">
              <Mail size={18} className="auth-input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="auth-input-container">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input auth-input--has-toggle ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-input-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-container">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input auth-input--has-toggle ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="auth-submit-spinner" />
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
