// api.ts
import { extend } from 'lodash';
import request from './request';
import { selectLocale } from '@app/selectors';
import store from '@store/stores';

export const url = {
  login: '/api/starter/auth/login',
  refreshToken: '/api/starter/auth/refresh-token',
};

interface ICallApi {
  endpoint: string;
  method: string;
  data?: any;
  headers?: object;
  params?: object;
}

const callApi = async ({ endpoint, method, data, headers = {}, params = {} }: ICallApi) => {
  const locale = selectLocale(store.getState());
  const defaultHeaders = {
    Accept: 'application/json',
    language: locale,
  };

  headers = extend(defaultHeaders, headers);

  const options = {
    baseURL: import.meta.env['VITE_API_URL'],
    method,
    url: endpoint,
    data,
    headers,
    params,
    timeout: 10000,
  };

  try {
    const response: any = await request(options);
    const responseAPI = response.data && response.data.data;
    responseAPI.message = response.data && response.data.message;
    return responseAPI;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const login = async (data: any) => {
  return callApi({ endpoint: url.login, method: 'POST', data });
};

export const refreshToken = async (refreshToken: string) => {
  return callApi({ endpoint: url.refreshToken, method: 'POST', data: { refreshToken } });
};
