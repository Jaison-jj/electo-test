import { AxiosResponse } from 'axios';

import axiosInstance from '@/lib/api';

type TGetBillsParams = {
  stateId: number;
  pageNumber: number;
};

export const getStateBills = async (
  params: TGetBillsParams,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/stateBills', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};

//Trending bills
export const getTrendingFederalBills = async (
  params: any,
  category: string,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`api/federalBills/${category}`, {
    headers: { 'Content-Type': 'application/json' },
    params,
  });
  return response.data;
};

export const getTrendingStateBills = async (
  params: any,
  category: string,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`api/stateBills/${category}`, {
    headers: { 'Content-Type': 'application/json' },
    params,
  });
  return response.data;
};

export const getStateBillSummary = async (
  data: any,
): Promise<AxiosResponse> => {
  const { id } = data;
  const response = await axiosInstance.get(`api/stateBills/${id}`, data);
  return response.data;
};

export const voteStateBill = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/stateBills/vote', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getStateBillComments = async (
  params: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/stateBills/comment', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
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

export const getFederalBills = async (
  params: TGetBillsParams,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/federalBills', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};

export const getFederalBillSummary = async (
  data: any,
): Promise<AxiosResponse> => {
  const { id } = data;
  const response = await axiosInstance.get(`api/federalBills/${id}`, data);
  return response.data;
};

export const voteFederalBill = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/federalBills/vote', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getFederalBillComments = async (
  params: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/federalBills/comment', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};

export const commentFederalBill = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/federalBills/comment', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getMyOfficials = async (
  params?: TGetBillsParams,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/representatives/user', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response?.data || [];
};

export const getCandidates = async (params?: any): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/officials/candidates', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response?.data || [];
};

type TgetAllOfficials = {
  pageNumber: number;
  state?: string;
  searchKey?: string;
};

export const getAllOfficials = async (
  data: TgetAllOfficials,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post('api/representatives', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const getStates = async (): Promise<AxiosResponse> => {
  const response = await axiosInstance.get('api/public/states', {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data.states;
};

export const getVotingRecords = async (
  params: any,
  billType: string,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.get(`api/${billType}/vote`, {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};

export const giveConsentForPetition = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/user/update-consent', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getPetitionDetails = async (params: any): Promise<any> => {
  const response = await axiosInstance.get('api/petition', {
    headers: { 'Content-Type': 'application/json' },
    params: params,
  });
  return response.data;
};

export const signPetition = async (data: any): Promise<any> => {
  const response = await axiosInstance.post('/api/petition/sign', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getRepresentativeVotingRecords = async (
  body: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    'api/representatives/voting-records',
    body,
  );
  return response.data;
};

export const representativesFundingResources = async (
  body: any,
): Promise<AxiosResponse> => {
  const response = await axiosInstance.post(
    'api/representatives/funding-source',
    body,
  );
  return response.data;
};
