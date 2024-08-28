import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
``;
import axiosInstance from '@/lib/api';

export const signUp = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('/api/auth/signup', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const signUpContinueSocial = async (
  data: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('/api/auth/signup-social', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const signIn = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    Cookies.set('electo_u_tok', response.data.token || 'no_token');
  }
  return response.data;
};

export const signInPhone = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/phone-login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const verifyOtp = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/verify-otp', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 201) {
    Cookies.set('electo_u_tok', response.data.token || 'no_token');
  }
  return response.data;
};

export const getResetPasswordOtp = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/forgot-password', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const verifyResetPasswordOtp = async (data: any): Promise<any> => {
  const response = await axiosInstance.post(
    '/api/auth/verify-forgot-password',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const resendOtp = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/resend-otp', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const setNewPassword = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/reset-password', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const verifyDriversLicense = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('api/public/verifyIdentity', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const googleSignInCallback = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/google-login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    Cookies.set('electo_u_tok', response.data.token || 'no_token');
  }
  return response.data;
};

export const facebookSignInCallback = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/facebook-login', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    Cookies.set('electo_u_tok', response.data.token || 'no_token');
  }
  return response.data;
};
