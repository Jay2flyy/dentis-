import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'client' | 'admin'>('client');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, enableDemoMode } = useAuth();

  const handleDemoMode = () => {
    enableDemoMode(userType === 'admin' ? 'admin' : 'patient');
    toast.success(`Demo mode enabled as ${userType}!`);
    
    if (userType === 'admin') {
      navigate('/admin/comprehensive');
    } else {
      navigate('/patient-dashboard');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signIn(email, password);
        toast.success('Login successful!');
        
        // Navigate based on user type
        if (userType === 'admin') {
          navigate('/admin/comprehensive');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        // Sign up
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              user_type: userType,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create patient record
          const { error: patientError } = await supabase
            .from('patients')
            .insert([
              {
                full_name: name,
                email: email,
                phone: '',
              },
            ]);

          if (patientError) console.error('Error creating patient record:', patientError);

          toast.success('Account created! Please check your email to verify.');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + (userType === 'admin' ? '/admin/comprehensive' : '/patient-dashboard'),
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Google authentication failed');
      console.error('Google auth error:', error);
    }
  };

  const handleAppleAuth = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin + (userType === 'admin' ? '/admin/comprehensive' : '/patient-dashboard'),
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Apple authentication failed');
      console.error('Apple auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6B9BD1] to-[#B794F6] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-white mb-2"
          >
            MAKHANDA SMILES
          </motion.h1>
          <p className="text-white/80">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Toggle Login/Signup */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                isLogin ? 'bg-[#B794F6] text-white shadow-lg' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-full font-semibold transition-all ${
                !isLogin ? 'bg-[#B794F6] text-white shadow-lg' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-50 rounded-xl">
            <button
              onClick={() => setUserType('client')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
                userType === 'client' ? 'bg-white text-[#B794F6] shadow' : 'text-gray-500'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
                userType === 'admin' ? 'bg-white text-[#B794F6] shadow' : 'text-gray-500'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#B794F6] hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAppleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B794F6] focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B794F6] focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#B794F6] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-[#B794F6] hover:text-[#9B7FD6] font-medium">
                  Forgot password?
                </Link>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
              {!loading && <ArrowRight size={20} />}
            </motion.button>

            {/* Demo Mode Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleDemoMode}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-3"
            >
              <Zap size={20} />
              Try Demo Mode (No Login Required)
            </motion.button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Demo mode lets you explore all features without creating an account
            </p>
          </form>

          {/* Terms */}
          {!isLogin && (
            <p className="text-xs text-gray-500 text-center mt-4">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-[#B794F6] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#B794F6] hover:underline">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white hover:text-white/80 font-medium">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
