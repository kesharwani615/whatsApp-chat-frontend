"use client";

import React, { useState } from "react";
import { LoginFormData, AuthError } from "../utils/module";
import { validateLogin } from "../service/validation";
import { useLoginMutation } from "@/redux RTK/api/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import { cookies } from 'next/headers';

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<AuthError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [login] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const res = await login(formData).unwrap();
      console.log("Login data:", res);
      localStorage.setItem("whatsApp", res.data.accessToken);
      if (res?.success) {
        router.push("/");
      }
  
      setFormData({
        email: "",
        password: "",
      });

      // router.push("/");
    } catch (error) {
      setErrors([{ message: "Login failed. Please check your credentials." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getError = (field: string) => {
    return errors.find((error) => error.field === field)?.message;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.some((error) => !error.field) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.find((error) => !error.field)?.message}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            getError("email") ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
        />
        {getError("email") && (
          <p className="mt-1 text-sm text-red-600">{getError("email")}</p>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              getError("password") ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {getError("password") && (
          <p className="mt-1 text-sm text-red-600">{getError("password")}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-medium text-green-600 hover:text-green-500 focus:outline-none"
        >
          Sign up
        </button>
      </div>
    </form>
  );
};

export default Login;
