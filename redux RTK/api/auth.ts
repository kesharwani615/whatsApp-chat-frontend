import { LoginFormData, LoginResponse, SignupFormData } from "@/utils/module";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  email: string;
  password: string;
}

export const Authapi = createApi({
  reducerPath: "Authapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4700/",
    prepareHeaders: (headers) => {
      // You can set default headers here if needed
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginFormData>({
      query: (credentials) => ({
        url: 'api/v1/user/login',
        method: 'POST',
        body: credentials,
        credentials: "include"
      }),
    }),
    signup: builder.mutation<any, SignupFormData>({
      query: (credentials) => ({
        url: 'api/v1/user/signup',
        method: 'POST',
        body: credentials
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = Authapi;