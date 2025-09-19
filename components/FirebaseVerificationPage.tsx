'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  Key,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

const FirebaseVerificationPage = () => {
  const [status, setStatus] = useState('loading');
  const [mode, setMode] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [continueUrl, setContinueUrl] = useState('/');

  useEffect(() => {
    const handleVerification = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const actionMode = urlParams.get('mode');
      const actionCode = urlParams.get('oobCode');
      const continueUrlParam = urlParams.get('continueUrl') || '/';
      
      setMode(actionMode || '');
      setContinueUrl(continueUrlParam);

      if (!actionMode || !actionCode) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        switch (actionMode) {
          case 'verifyEmail':
            await applyActionCode(auth, actionCode);
            setStatus('success');
            setMessage('Email verified successfully');
            break;
            
          case 'resetPassword':
            const email = await verifyPasswordResetCode(auth, actionCode);
            setUserEmail(email);
            setStatus('reset');
            setMessage('Enter your new password');
            break;
            
          case 'recoverEmail':
            await applyActionCode(auth, actionCode);
            setStatus('success');
            setMessage('Email recovered successfully');
            break;
            
          default:
            setStatus('error');
            setMessage('Unknown action type');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed');
      }
    };

    handleVerification();
  }, []);

  const handlePasswordReset = async (newPassword) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const actionCode = urlParams.get('oobCode');
      
      await confirmPasswordReset(auth, actionCode, newPassword);
      setStatus('success');
      setMessage('Password reset successfully');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Password reset failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 animate-spin text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-amber-400" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-400" />;
      case 'reset':
        return <Key className="w-12 h-12 text-amber-400" />;
      default:
        return <Mail className="w-12 h-12 text-gray-400" />;
    }
  };

  const getTitle = () => {
    if (status === 'loading') return 'Processing...';
    
    switch (mode) {
      case 'verifyEmail':
        return status === 'success' ? 'Email Verified' : 'Verification Failed';
      case 'resetPassword':
        return status === 'success' ? 'Password Reset' : 'Reset Password';
      case 'recoverEmail':
        return status === 'success' ? 'Email Recovered' : 'Recovery Failed';
      default:
        return 'Authentication';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo/Brand */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                KelvinTopup
              </h2>
            </div>

            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex justify-center">
                {getStatusIcon()}
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">
                {getTitle()}
              </h1>
              <p className="text-gray-400">{message}</p>
            </div>

            {status === 'reset' && <PasswordResetForm onSubmit={handlePasswordReset} />}
            
            {status === 'success' && (
              <div className="space-y-4">
                <button
                  onClick={() => window.location.href = continueUrl}
                  className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen relative z-10">
        {/* Left Panel */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent"></div>
          <div className="text-center text-white max-w-lg relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-black" />
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Secure Verification
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Your account security is our top priority. We use industry-standard encryption and multi-factor authentication to protect your data.
            </p>
            <div className="flex items-center justify-center space-x-2 text-amber-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-12 bg-white text-black relative">
          <div className="absolute inset-0 bg-gradient-to-l from-amber-50/30 via-transparent to-transparent"></div>
          <div className="w-full max-w-md relative z-10">
            {/* Brand Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                KelvinTopup
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="text-center mb-10">
              <div className="mx-auto mb-6 flex justify-center">
                {status === 'loading' ? (
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  getStatusIcon()
                )}
              </div>
              <h1 className="text-3xl font-bold text-black mb-3">
                {getTitle()}
              </h1>
              <p className="text-gray-600 text-lg">{message}</p>
            </div>

            {status === 'reset' && <PasswordResetForm onSubmit={handlePasswordReset} />}
            
            {status === 'success' && (
              <div className="space-y-6">
                <button
                  onClick={() => window.location.href = continueUrl}
                  className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
                >
                  Continue to App <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordResetForm = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(password);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );
};

export default FirebaseVerificationPage;