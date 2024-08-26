import axios, { type AxiosRequestConfig } from 'axios';

export default async function request(options: AxiosRequestConfig<any>) {
  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    return await Promise.reject(error);
  }
}
