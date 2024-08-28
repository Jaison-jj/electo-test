import { AxiosResponse } from 'axios';
``;
import axiosInstance from '@/lib/api';

export const nextQuestion = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    '/api/polling/next-question',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const addAnswer = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('/api/polling/answer', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getPollingWiseMapData = async (
  data: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    '/api/polling/poll-percentage',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const pollAnalysis = async (data: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    '/api/polling/question-analysis',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};
