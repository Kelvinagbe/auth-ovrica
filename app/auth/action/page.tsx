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
            setMessage('Email verified successfully. You can now login to your account.');
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
        let userFriendlyMessage = 'Verification failed';
        
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('invalid-action-code') || errorMessage.includes('expired-action-code')) {
            userFriendlyMessage = 'This verification link is invalid or has expired. Please request a new one.';
          } else if (errorMessage.includes('user-disabled')) {
            userFriendlyMessage = 'This account has been disabled. Please contact support.';
          } else if (errorMessage.includes('user-not-found')) {
            userFriendlyMessage = 'No account found with this email address.';
          } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection')) {
            userFriendlyMessage = 'Network connection failed. Please check your internet connection and try again.';
          } else if (errorMessage.includes('too-many-requests')) {
            userFriendlyMessage = 'Too many attempts. Please wait a moment and try again.';
          } else if (errorMessage.includes('quota-exceeded')) {
            userFriendlyMessage = 'Service temporarily unavailable. Please try again later.';
          }
        }
        
        setMessage(userFriendlyMessage);
      }
    };

    handleVerification();
  }, []);

  const handlePasswordReset = async (newPassword: string) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const actionCode = urlParams.get('oobCode');

      if (!actionCode) {
        throw new Error('Invalid action code');
      }

      await confirmPasswordReset(auth, actionCode, newPassword);
      setStatus('success');
      setMessage('Password reset successfully. You can now login with your new password.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Password reset failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="relative w-24 h-2">
            <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent w-1/3 animate-pulse rounded-full relative">
                <div className="absolute inset-0 bg-white animate-[slideRight_2s_ease-in-out_infinite] rounded-full"></div>
              </div>
            </div>
            <div className="absolute -top-1 -bottom-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[slideRight_1.5s_ease-in-out_infinite] rounded-full"></div>
          </div>
        );
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-400" />;
      case 'reset':
        return <Key className="w-12 h-12 text-white" />;
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
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300 rounded-full mix-blend-screen filter blur-2xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full mix-blend-screen filter blur-2xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/3 right-1/3 w-88 h-88 bg-gray-200 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-3000"></div>
        </div>
        {/* Moving particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-gray-300 rounded-full animate-bounce animation-delay-2000"></div>
          <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white rounded-full animate-bounce animation-delay-3000"></div>
          <div className="absolute bottom-20 right-40 w-1 h-1 bg-gray-400 rounded-full animate-bounce animation-delay-500"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Mobile View */}
      <div className="lg:hidden relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          <div className="w-full max-w-sm mx-auto">
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
              <div className="space-y-6">
                {/* No button - just confirmation */}
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex min-h-screen relative z-10 items-center justify-center p-8">
        {/* Main Container */}
        <div className="flex w-full max-w-7xl h-[600px] bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Panel */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 flex items-center justify-center p-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="text-center text-white max-w-lg relative z-10">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Secure Verification
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Your account security is our top priority. We use industry-standard encryption and multi-factor authentication to protect your data.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse animation-delay-300"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse animation-delay-600"></div>
                </div>
                <span className="text-white/60 text-sm font-medium">Processing</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex items-center justify-center p-12 bg-white/95 backdrop-blur-sm text-black relative">
            <div className="absolute inset-0 bg-gradient-to-l from-gray-50/50 via-transparent to-transparent"></div>
            <div className="w-full max-w-md relative z-10">
              <div className="text-center mb-10">
                <div className="mx-auto mb-8 flex justify-center">
                  {status === 'loading' ? (
                    <div className="relative w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="h-full bg-gradient-to-r from-transparent via-black to-transparent w-1/2 animate-[slideRight_2s_ease-in-out_infinite] rounded-full"></div>
                      </div>
                      <div className="absolute -inset-y-0.5 inset-x-0 bg-gradient-to-r from-transparent via-black/30 to-transparent w-3/4 animate-[slideRight_1.8s_ease-in-out_infinite] rounded-full"></div>
                    </div>
                  ) : (
                    <div className="text-black">
                      {status === 'success' && <CheckCircle className="w-12 h-12 text-green-500" />}
                      {status === 'error' && <XCircle className="w-12 h-12 text-red-500" />}
                      {status === 'reset' && <Key className="w-12 h-12 text-black" />}
                    </div>
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
                  {/* No button - just confirmation */}
                </div>
              )}

              {status === 'error' && (
                <div className="text-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="text-gray-600 hover:text-black font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
      let userFriendlyMessage = 'An error occurred';
      
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('invalid-action-code') || errorMessage.includes('expired-action-code')) {
          userFriendlyMessage = 'This reset link is invalid or has expired. Please request a new password reset.';
        } else if (errorMessage.includes('weak-password')) {
          userFriendlyMessage = 'Password must be at least 8 characters long and include numbers, letters, and symbols.';
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
          userFriendlyMessage = 'Network connection failed. Please check your internet connection and try again.';
        } else if (errorMessage.includes('too-many-requests')) {
          userFriendlyMessage = 'Too many password reset attempts. Please wait 15 minutes and try again.';
        } else if (errorMessage.includes('internal-error') || errorMessage.includes('service-unavailable')) {
          userFriendlyMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
        }
      }
      
      setError(userFriendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-black bg-white placeholder-gray-500"
            required
            minLength={6}
            placeholder="Enter new password"
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
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors text-black bg-white placeholder-gray-500"
            required
            minLength={6}
            placeholder="Confirm new password"
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
        onClick={handleSubmit}
        className="w-full flex justify-center items-center px-6 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
      >
        {isSubmitting ? (
          <>
            <div className="relative mr-3 w-8 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent w-1/2 animate-[slideRight_1.5s_ease-in-out_infinite] rounded-full"></div>
            </div>
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </button>
    </div>
  );
};

export default FirebaseVerificationPage;