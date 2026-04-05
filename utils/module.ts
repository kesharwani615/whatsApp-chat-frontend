// src/types/auth.ts
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  mobile: string;
}

export interface Userlogin{
  _id: string;
  name: string;
  username: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
};

export interface LoginResponse {
  statusCode: number;
  data: {
    user: Userlogin;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}


export interface AuthError {
  field?: string;
  message: string;
}

export interface User{
  _id: string;
  name: string;
  username: string;
  email: string;
  mobileNumber: string;
};

export interface userData{
  data:User[]
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: string[]; // array of user IDs who have read the message
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
export interface MessageData {
  data: Message[];
}