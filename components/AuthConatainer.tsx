'use client';
// src/components/Auth/AuthContainer.tsx
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthContainerProps {
  initialMode?: 'login' | 'signup';
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-green-600 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold">WhatsApp Clone</h1>
          <p className="text-green-100 mt-1">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        <div className="p-8">
          {isLogin ? (
            <Login onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;