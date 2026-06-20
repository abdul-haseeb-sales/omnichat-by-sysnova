import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
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
    if (successMsg) setSuccessMsg('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setApiError(error.message || 'Invalid email or password.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Validate email first
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Enter your email to reset password' }));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address' }));
      return;
    }

    setResetLoading(true);
    setApiError('');
    setSuccessMsg('');

    try {
      const { error } = await resetPassword(formData.email);
      if (error) {
        setApiError(error.message || 'Failed to send reset email.');
      } else {
        setSuccessMsg('Password reset link sent! Check your inbox.');
      }
    } catch (err) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating orbs */}
      <div className="auth-orb auth-orb--1" />
      <div className="auth-orb auth-orb--2" />
      <div className="auth-orb auth-orb--3" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <MessageCircle size={28} strokeWidth={2.2} />
          </div>
          <div className="auth-logo-text">
            <h1>OmniChat</h1>
            <p>Welcome back</p>
          </div>
        </div>

        {/* Error alert */}
        {apiError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <span className="auth-alert-icon">⚠</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Success alert */}
        {successMsg && (
          <div className="auth-alert auth-alert--success" role="status">
            <span className="auth-alert-icon">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
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
                autoFocus
              />
            </div>
            {errors.email && (
              <span className="auth-field-error">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="auth-input-container">
              <Lock size={18} className="auth-input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input auth-input--has-toggle ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="auth-field-error">{errors.password}</span>
            )}
          </div>

          {/* Forgot Password */}
          <div className="auth-forgot">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
            >
              {resetLoading ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="auth-submit-spinner" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/signup">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
