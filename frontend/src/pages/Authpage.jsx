import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ticket, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Loader } from 'lucide-react';
import { login, register } from './api';

export default function TicketEaseAuth() {
  const location = useLocation();
  const navigate = useNavigate();

  // read redirect and payload passed from previous page (EventDetails)
  const { redirectTo, payload } = location.state || {};

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [termsChecked, setTermsChecked] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  // Auth helpers
  const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));
  
  const saveAuth = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  // If already authenticated, redirect automatically to intended destination
  useEffect(() => {
    if (isAuthenticated()) {
      const dest = redirectTo || '/events';
      navigate(dest, { state: payload || null, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return false;
    }
    
    // Email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    // Password validation
    if (formData. password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    
    // Signup-specific validations
    if (! isLogin) {
      if (! formData.name || formData.name.trim().length < 2) {
        setError('Please enter your full name (min 2 characters).');
        return false;
      }
      if (!termsChecked) {
        setError('You must agree to the Terms of Service and Privacy Policy.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isLogin) {
        // Login with backend API
        response = await login({
          email: formData.email,
          password: formData. password,
        });
      } else {
        // Signup with backend API
        response = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }

      // Save auth token and user data
      if (response.token && response.user) {
        saveAuth(response.token, response. user);
        
        // Redirect to the intended page with payload (if provided)
        const dest = redirectTo || '/events';
        navigate(dest, { state: payload || null });
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      // Handle specific error messages from backend
      if (err.body && err.body.error) {
        setError(err.body.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(
          isLogin 
            ? 'Invalid email or password. Please try again.' 
            : 'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setError(`${provider} login is not yet implemented.  Please use email/password.`);
    
    // TODO: Implement social login with your backend
    // This would typically involve:
    // 1. Redirect to OAuth provider
    // 2. Handle callback
    // 3. Exchange code for token
    // 4. Save token and redirect
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target. name]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const toggleMode = () => {
    setIsLogin((s) => !s);
    setError('');
    setShowPassword(false);
    setFormData((p) => ({ ...p, password: '' }));
    setTermsChecked(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #6F2CFD, #5a24d9, #7c3ef5)' }}>
      <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center" style={{ background: 'linear-gradient(to right, #6F2CFD, #8a4eff)' }}>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-full">
                <Ticket className="w-10 h-10" style={{ color:  '#6F2CFD' }} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">TicketEase</h1>
            <p className="text-purple-100">Your gateway to unforgettable events</p>
          </div>

          {/* Form */}
          <form className="p-8" onSubmit={handleSubmit} aria-live="polite">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin
                  ? 'Login to access your tickets'
                  : 'Sign up to start booking tickets'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                      aria-label="Full name"
                      autoComplete="name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus: ring-purple-500 focus: border-transparent"
                    placeholder="you@example.com"
                    aria-label="Email address"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone field - only for signup */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus: ring-purple-500 focus: border-transparent"
                      placeholder="+1 (555) 000-0000"
                      aria-label="Phone number"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="••••••••"
                    aria-label="Password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot password - only for login */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#6F2CFD' }}
                    onClick={() => alert('Password reset functionality coming soon!')}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Terms and conditions - only for signup */}
              {!isLogin && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    aria-required
                    required={!isLogin}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="font-medium hover:underline" style={{ color: '#6F2CFD' }} onClick={(e) => e.preventDefault()}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="font-medium hover:underline" style={{ color: '#6F2CFD' }} onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 shadow-lg flex items-center justify-center gap-2 ${
                  loading ?  'opacity-70 cursor-not-allowed' :  'hover:shadow-xl transform hover:scale-[1.02]'
                }`}
                style={{ background: 'linear-gradient(to right, #6F2CFD, #8a4eff)' }}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Create Account'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-. 26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-. 98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-. 22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s. 43 3.45 1.18 4.93l2.85-2.22.81-. 62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Toggle between login and signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?  " : "Already have an account?  "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-semibold hover:underline"
                  style={{ color: '#6F2CFD' }}
                  disabled={loading}
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white text-sm mt-6 opacity-90">
          🔒 Secure authentication powered by TicketEase
        </p>
      </div>
    </div>
  );
}