import { AxiosResponse } from 'axios';

import axiosInstance from '@/lib/api';

export const getVoteAnalytics = async (
  params: any,
  data: any,
): Promise<AxiosResponse> => {
  const url =
    data.billType === 'federal'
      ? 'api/federalBills/data-hub'
      : 'api/stateBills/data-hub';
  const response = await axiosInstance.get(url, {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};
