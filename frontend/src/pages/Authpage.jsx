import React, { useEffect, useState, useRef, useCallback, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Ticket, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, 
  Loader, CheckCircle, Sparkles, Shield, ArrowRight 
} from 'lucide-react';
import { login, register } from './api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_URL = import.meta.env. VITE_API_URL || 'http://localhost:4000/api';

// Add animations
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('ticket-ease-animations');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'ticket-ease-animations';
    style.textContent = `
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(20px, -50px) scale(1.1); }
        50% { transform: translate(-20px, 20px) scale(0.9); }
        75% { transform: translate(50px, 50px) scale(1.05); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(10px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform:  translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      @keyframes slide-down {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scale-in {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      . animate-blob { animation: blob 7s infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }
      .animate-float { animation: float 8s ease-in-out infinite; }
      .animate-shake { animation: shake 0.3s ease-in-out; }
      .animate-slide-down { animation: slide-down 0.3s ease-out; }
      .animate-scale-in { animation: scale-in 0.3s ease-out; }
    `;
    document.head.appendChild(style);
  }
}

// Error Boundary Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError:  true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[44px] text-amber-600 text-sm bg-amber-50 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 mr-2" />
          Google Sign-In temporarily unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

// Google Button Component
function GoogleSignInButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRendered, setHasRendered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    let checkInterval;

    const initGoogle = () => {
      if (! window.google || !buttonRef.current || hasRendered) return;

      if (! GOOGLE_CLIENT_ID) {
        const errorMsg = 'Google Sign-In not configured';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id:  GOOGLE_CLIENT_ID,
          callback: onSuccess,
          auto_select: false,
          cancel_on_tap_outside:  true,
        });

        if (buttonRef.current && isMounted) {
          buttonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 350,
          });
          
          setHasRendered(true);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          const errorMsg = 'Failed to load Google Sign-In';
          setError(errorMsg);
          setIsLoading(false);
          onError?.(errorMsg);
        }
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      checkInterval = setInterval(() => {
        if (window. google) {
          clearInterval(checkInterval);
          initGoogle();
        }
      }, 100);

      timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        if (isMounted && ! hasRendered) {
          const errorMsg = 'Google Sign-In is taking too long to load';
          setError(errorMsg);
          setIsLoading(false);
          onError?.(errorMsg);
        }
      }, 10000);
    }

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [onSuccess, onError, hasRendered]);

  if (error) {
    return (
      <div className="w-full flex justify-center items-center text-amber-600 text-sm p-3 bg-amber-50 rounded-xl border border-amber-200">
        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center" style={{ minHeight: '44px' }}>
      {isLoading && ! hasRendered && (
        <div className="flex items-center justify-center text-gray-500 text-sm">
          <Loader className="w-4 h-4 animate-spin mr-2" />
          Loading Google Sign-In...
        </div>
      )}
      <div ref={buttonRef} className="w-full max-w-[350px]" />
    </div>
  );
}

function TicketEaseAuth() {
  const location = useLocation();
  const navigate = useNavigate();
  const scriptLoaded = useRef(false);
  const { redirectTo, payload } = location.state || {};

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));
  
  const saveAuth = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  };

  // Load Google script
  useEffect(() => {
    if (scriptLoaded.current || document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => { scriptLoaded.current = true; };
    document.body.appendChild(script);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo || '/', { state: payload || null, replace: true });
    }
  }, [navigate, redirectTo, payload]);

  const handleGoogleSuccess = useCallback(async (response) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (res.ok && data.token && data.user) {
        saveAuth(data.token, data. user);
        setSuccess('Google login successful!  Redirecting.. .');
        setTimeout(() => {
          navigate(redirectTo || '/', { state: payload || null });
        }, 1000);
      } else {
        setError(data.error || data.message || 'Google authentication failed');
      }
    } catch (err) {
      setError('Failed to authenticate with Google.  Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate, redirectTo, payload]);

  const handleGoogleError = useCallback((errorMsg) => {
    setError(errorMsg);
  }, []);

  const validate = () => {
    setError('');
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData. email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (formData.password. length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
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
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = isLogin 
        ? await login({ email: formData.email, password: formData.password })
        : await register({ 
            name: formData.name, 
            email: formData.email, 
            phone: formData.phone, 
            password: formData. password 
          });

      if (response.token && response.user) {
        saveAuth(response.token, response. user);
        setSuccess(isLogin ? 'Login successful!  Redirecting...' : 'Account created!  Redirecting...');
        setTimeout(() => {
          navigate(redirectTo || '/', { state: payload || null });
        }, 1000);
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError(err.body?.error || err.message || (isLogin ? 'Invalid email or password' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const toggleMode = () => {
    setIsLogin((s) => !s);
    setError('');
    setSuccess('');
    setShowPassword(false);
    setFormData({ email: '', password: '', name:  '', phone: '' });
    setTermsChecked(false);
    setFocusedField('');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/. test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/. test(password)) strength++;
    
    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = ! isLogin ? getPasswordStrength(formData.password) : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute animate-float" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 5}s`, 
              animationDuration:  `${5 + Math.random() * 10}s` 
            }}
          >
            <Sparkles className="w-4 h-4 text-white opacity-20" />
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="relative p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-110 hover:rotate-6">
                  <Ticket className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                TicketEase
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h1>
              <p className="text-purple-100 text-sm">Your gateway to unforgettable experiences</p>
            </div>
          </div>

          {/* Form */}
          <form className="p-8" onSubmit={handleSubmit}>
            {/* Toggle Pills */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button 
                type="button" 
                onClick={() => ! loading && ! isLogin && toggleMode()} 
                disabled={loading} 
                className={`flex-1 py-2. 5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    :  'text-gray-600 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => !loading && isLogin && toggleMode()} 
                disabled={loading} 
                className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              {/* Name Field (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative transition-transform duration-200 ${focusedField === 'name' ? 'transform scale-[1.02]' : ''}`}>
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'name' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData. name} 
                      onChange={handleChange} 
                      onFocus={() => setFocusedField('name')} 
                      onBlur={() => setFocusedField('')} 
                      className="w-full pl-11 pr-4 py-3. 5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 focus:bg-white" 
                      placeholder="John Doe" 
                      required={! isLogin} 
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className={`relative transition-transform duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-purple-600' :  'text-gray-400'}`} />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    onFocus={() => setFocusedField('email')} 
                    onBlur={() => setFocusedField('')} 
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus: ring-4 focus:ring-purple-500/20 focus: border-purple-500 bg-gray-50 focus:bg-white" 
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>

              {/* Phone Field (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className={`relative transition-transform duration-200 ${focusedField === 'phone' ? 'transform scale-[1.02]' : ''}`}>
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'phone' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      onFocus={() => setFocusedField('phone')} 
                      onBlur={() => setFocusedField('')} 
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 focus:bg-white" 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className={`relative transition-transform duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <input 
                    type={showPassword ? 'text' :  'password'} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    onFocus={() => setFocusedField('password')} 
                    onBlur={() => setFocusedField('')} 
                    className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus: ring-4 focus:ring-purple-500/20 focus: border-purple-500 bg-gray-50 focus:bg-white" 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword((s) => !s)} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> :  <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator (Sign Up only) */}
                {!isLogin && formData.password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-bold ${
                        passwordStrength.label === 'Weak' ? 'text-red-500' : 
                        passwordStrength.label === 'Fair' ? 'text-yellow-500' : 
                        passwordStrength.label === 'Good' ? 'text-blue-500' : 
                        'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-500`} 
                        style={{ width:  `${(passwordStrength.strength / 5) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors" 
                    onClick={() => alert('Password reset coming soon!')}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Terms Checkbox (Sign Up only) */}
              {!isLogin && (
                <div className="flex items-start bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer" 
                    checked={termsChecked} 
                    onChange={(e) => setTermsChecked(e.target.checked)} 
                    required={!isLogin} 
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the{' '}
                    <a href="/terms" className="font-semibold text-purple-600 hover:underline" onClick={(e) => e.preventDefault()}>
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" className="font-semibold text-purple-600 hover:underline" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-slide-down">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 animate-scale-in" />
                  <p className="text-sm font-medium text-green-700">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || !!success} 
                className={`w-full text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group ${
                  loading || success 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover: shadow-2xl hover:shadow-purple-500/50 transform hover: scale-[1.02]'
                } bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isLogin ?  'Logged in!' : 'Account created!'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login' :  'Create Account'}
                    <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-semibold">Or continue with</span>
              </div>
            </div>

            {/* Google Button with Error Boundary */}
            <ErrorBoundary>
              <GoogleSignInButton 
                onSuccess={handleGoogleSuccess} 
                onError={handleGoogleError} 
              />
            </ErrorBoundary>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
            <Shield className="w-4 h-4" />
            <p>Secure authentication • Your data is protected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketEaseAuth;