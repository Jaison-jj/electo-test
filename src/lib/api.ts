import axios, { AxiosError, AxiosResponse } from 'axios';
import { AxiosRequestHeaders } from 'axios';
import Cookies from 'js-cookie';
import Qs from 'qs';
import { toast } from 'sonner';

let isSignInPage = null;
if (typeof window === 'object') {
  isSignInPage = window.location.pathname.includes('sign-in');
}

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL as string,
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    // const token = localStorage.getItem('electo_u_tok') || '';
    const token = Cookies.get('electo_u_tok');
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...config.headers,
    } as AxiosRequestHeaders;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response &&
      !isSignInPage &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Handle 401 status and avoid infinite retries
      toast('Session timed out! Please sign in.', {
        description: '',
        duration: 3000,
        action: {
          label: 'Close',
          onClick: () => null,
        },
      });
      Cookies.remove('electo_u_tok');
      window.location.pathname = '/sign-in';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
