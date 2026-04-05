'use client';

// src/components/Auth/Signup.tsx
import React, { useState } from 'react';
import { SignupFormData, AuthError } from '../utils/module';
import { validateSignup } from '../service/validation';
import { useSignupMutation } from '@/redux RTK/api/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
  });
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [signup] = useSignupMutation();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignup(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    setIsLoading(true);
    
   try {
  const res = await signup(formData).unwrap();
  if(res.success){
    toast.success(res.message);
    router.push("/login");
  }
  console.log("Signup Success:", res);
} catch (error: any) {
  console.log("Signup Error:", error);
  setErrors([{ message: error?.data?.message || "Something went wrong" }]);
} finally {
  setIsLoading(false);
}
  };

  const getError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.some(error => !error.field) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.find(error => !error.field)?.message}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${getError('name') ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError('name') && (
          <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${getError('username') ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError('username') && (
          <p className="mt-1 text-sm text-red-600">{getError('username')}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${getError('email') ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError('email') && (
          <p className="mt-1 text-sm text-red-600">{getError('email')}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${getError('password') ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError('password') && (
          <p className="mt-1 text-sm text-red-600">{getError('password')}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
          Mobile Number
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${getError('mobile') ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError('mobile') && (
          <p className="mt-1 text-sm text-red-600">{getError('mobile')}</p>
        )}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-green-600 hover:text-green-500 focus:outline-none"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default Signup;