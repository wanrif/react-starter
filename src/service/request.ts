// request.ts
import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import store from '@store/stores';
import { selectRefreshToken, selectAccessToken } from '@pages/Login/selectors';
import { loginSuccess, logoutSuccess } from '@pages/Login/reducer';
import { apiUrl } from './api';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

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
    const response = await axios.post(apiUrl.refreshToken, { refreshToken });
    const { accessToken, newRefreshToken } = response.data;
    store.dispatch(loginSuccess({ access_token: accessToken, refresh_token: newRefreshToken }));
    return accessToken;
  } catch (_error) {
    store.dispatch(logoutSuccess());
    return null;
  }
};

export default async function request(options: AxiosRequestConfig<any>) {
  const accessToken = selectAccessToken(store.getState());

  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await axios(options);
    return response;
  } catch (error: any) {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshTokenRequest()
          .then((newToken) => {
            if (newToken) {
              originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
              processQueue(null, newToken);
              resolve(axios(originalRequest));
            } else {
              processQueue(error, null);
              reject(error);
            }
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
}
