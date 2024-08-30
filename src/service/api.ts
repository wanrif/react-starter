// api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import store from '@store/stores';
import { selectRefreshToken, selectAccessToken } from '@pages/Login/selectors';
import { loginSuccess, logoutSuccess } from '@pages/Login/reducer';
import { selectLocale } from '@app/selectors';

export const apiUrl = {
  login: '/api/starter/auth/login',
  refreshToken: '/api/starter/auth/refresh-token',
};

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env['VITE_API_URL'],
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshTokenRequest = async () => {
  const refreshToken = selectRefreshToken(store.getState());
  try {
    const response = await api.post(apiUrl.refreshToken, { refreshToken });
    const { accessToken, newRefreshToken } = response.data;
    store.dispatch(loginSuccess({ access_token: accessToken, refresh_token: newRefreshToken }));
    return accessToken;
  } catch (_error) {
    store.dispatch(logoutSuccess());
    return null;
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = selectAccessToken(store.getState());
    const locale = selectLocale(store.getState());

    config.headers = config.headers || {};
    config.headers['Accept'] = 'application/json';
    config.headers['language'] = locale;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message: string }>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenRequest();
        if (newToken) {
          processQueue(null, newToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

interface ICallApi {
  endpoint: string;
  method: string;
  data?: any;
  headers?: object;
  params?: object;
}

const callApi = async ({ endpoint, method, data, headers = {}, params = {} }: ICallApi) => {
  try {
    const response = await api.request({
      url: endpoint,
      method,
      data,
      headers,
      params,
    });
    const responseAPI = response.data && response.data.data;
    responseAPI.message = response.data && response.data.message;
    return responseAPI;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const login = async (data: any) => {
  return callApi({ endpoint: apiUrl.login, method: 'POST', data });
};

export const refreshToken = async (refreshToken: string) => {
  return callApi({ endpoint: apiUrl.refreshToken, method: 'POST', data: { refreshToken } });
};
