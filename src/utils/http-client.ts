import AxiosClient from 'axios';
import type { ResponseBody } from '../types';

export const RESTClient = AxiosClient;

export class HTTPClient {
  public static setupDefaultBehavior () {
    RESTClient.interceptors.response.use(
      response => response,
      error => {
        return Promise.resolve({
          error: {
            value: true,
            message: ['Error', error?.message ?? JSON.stringify(error)].join(':'),
            timestamp: Date.now()
          },
          value: undefined
        } as ResponseBody<undefined>);
      }
    );
  }

  public static configRequestHeaders (headers: Record<string, string>) {
    RESTClient.interceptors.request.use((config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          ...headers
        }
      };
    });
  }

  public static head = RESTClient.head;
  public static options = RESTClient.options;
  public static get = RESTClient.get;
  public static post = RESTClient.post;
  public static put = RESTClient.put;
  public static patch = RESTClient.patch;
  public static delete = RESTClient.delete;
}
