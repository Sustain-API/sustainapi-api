import axios, { AxiosInstance } from 'axios';

export default class RequestUtil {
  static makePostRequest = (url: string, data: any, headers?: any, timeout?: number) => {
    return RequestUtil.getAxiosInstance(headers, timeout).post(url, data);
  };

  static makePutRequest = (url: string, data: any, headers?: any, timeout?: number) => {
    return RequestUtil.getAxiosInstance(headers, timeout).put(url, data);
  };

  static makePatchRequest = (url: string, data: any, headers?: any, timeout?: number) => {
    return RequestUtil.getAxiosInstance(headers, timeout).patch(url, data);
  };

  static makeGetRequest = (url: string, headers?: any, timeout?: number) => {
    return RequestUtil.getAxiosInstance(headers, timeout).get(url);
  };

  /**
   * Single axios instance for all our calls.
   * @param headers
   * @param timeout
   * @returns
   */
  private static getAxiosInstance = (headers?: any, timeout = 45000): AxiosInstance => {
    return axios.create({
      timeout,
      headers,
    });
  };
}
