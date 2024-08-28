import { AxiosResponse } from 'axios';

import axiosInstance from '@/lib/api';

export const share = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('/api/share-data/get', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
