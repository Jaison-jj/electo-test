import { AxiosResponse } from 'axios';

import axiosInstance from '@/lib/api';

export const getStateMapVoteData = async (
  params: any,
  data: any,
): Promise<AxiosResponse> => {
  const { billId } = data;
  const response = await axiosInstance.get(
    `api/stateBills/map-data/${billId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      params: params,
    },
  );
  return response.data;
};

export const getFederalMapVoteData = async (
  params: any,
  data: any,
): Promise<AxiosResponse> => {
  const { billId } = data;
  const response = await axiosInstance.get(
    `api/federalBills/map-data/${billId}`,
    {
      headers: { 'Content-Type': 'application/json' },
      params: params,
    },
  );
  return response.data;
};

export const commentStateBill = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/stateBills/comment', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
