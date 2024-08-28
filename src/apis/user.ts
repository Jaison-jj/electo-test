import { AxiosResponse } from 'axios';

// import Cookies from 'js-cookie';
import axiosInstance from '@/lib/api';

export const saveInterests = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.put('/api/user/interests', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const changePhone = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/change-phone', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const changeEmail = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/auth/change-email', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getProfile = async (): Promise<any> => {
  const response = await axiosInstance.get(`/api/user/profile`);
  return response.data;
};

export const updateProfile = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.put('/api/user', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updatePassword = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.put('/api/user/change-password', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const updateProfileImage = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.put('/api/user/profile-picture', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getLeaderBoardCitizens = async (): Promise<any> => {
  const response = await axiosInstance.get(`/api/user/leaderboard`);
  return response?.data;
};

export const getLeaderBoardOfficials = async (): Promise<any> => {
  const response = await axiosInstance.get(`/api/representatives/leaderboard`);
  return response?.data;
};

export const searchEntity = async (params: any): Promise<any> => {
  const response = await axiosInstance.get(`/api/user/search`, {
    params,
  });
  return response.data;
};

export const getRepresentative = async (id: string): Promise<any> => {
  const response = await axiosInstance.get(`/api/representatives/${id}`);
  return response.data;
};
