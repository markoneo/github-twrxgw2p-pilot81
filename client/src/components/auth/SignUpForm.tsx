import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setMessage('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate password length
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    try {
      setLoading(true);
      setMessage('Creating your account...');
      await signup(email, password);
      setMessage('Account created successfully!');
      
      // Optional success callback
      if (onSuccess) onSuccess();
      
      // Use window.location for a full page reload to ensure session is properly picked up
      window.location.href = '/dashboard';
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create an account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-lg">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 flex items-center text-sm">
          <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 flex items-center text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoComplete="email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoComplete="new-password"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoComplete="new-password"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </div>
  );
}