import { HttpClient, HttpClientSearchParams } from '@/shared/httpClient';
import { ApiResponse } from '@/shared/types/ApiResponse';
import { useAuthStore } from '@/stores/authStore';
import { AbstractResponseTokenResponse } from './_model';

export const instance = new HttpClient({
  baseURL: '',
  headers: {
    Accept: 'application/json',
    'Accept-Charset': 'utf-8'
  }
});

let refreshPromise: Promise<AbstractResponseTokenResponse> | null = null;

instance.interceptors.response.use<ApiResponse>(
  async (response, config) => {
    if (response.data.responseCode !== 'ACCESS_TOKEN_EXPIRED') {
      return response.data;
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      useAuthStore.getState().logout();
      return response.data;
    }

    if (!refreshPromise) {
      refreshPromise = customInstance({
        url: '/auth/refresh',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { refreshToken }
      });
    }
    const { payload, responseCode } = await refreshPromise;
    if (responseCode !== 'SUCCESS') {
      useAuthStore.getState().logout();
      return response.data;
    }

    useAuthStore
      .getState()
      .setTokens({ accessToken: payload?.accessToken ?? '', refreshToken: payload?.refreshToken ?? '' });

    return await instance.call(config);
  },
  async (error, config) => {
    if (error.response?.status !== 401) {
      return error;
    }

    if (config.url === '/auth/refresh') {
      return error;
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      return error;
    }

    if (!refreshPromise) {
      refreshPromise = customInstance({
        url: '/auth/refresh',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { refreshToken }
      });
    }
    const { payload } = await refreshPromise;
    useAuthStore
      .getState()
      .setTokens({ accessToken: payload?.accessToken ?? '', refreshToken: payload?.refreshToken ?? '' });

    return instance.call(config);
  }
);

instance.interceptors.request.use(async (config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (config.url.includes('auth')) {
    return config;
  }

  if (!accessToken) {
    return config;
  }

  if (typeof config.headers?.append === 'function') {
    config.headers?.append('Authorization', `Bearer ${accessToken}`);
    return config;
  }

  if (Array.isArray(config.headers)) {
    config.headers.push(['Authorization', `Bearer ${accessToken}`]);
    return config;
  }

  if (config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  }

  return config;
});

export const customInstance = async <T>({
  url,
  method,
  params,
  data,
  headers
}: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: HttpClientSearchParams;
  data?: BodyType<unknown>;
  headers?: Record<string, string>;
}): Promise<T> => {
  const response = await instance.call<T>({
    url: url,
    method,
    params,
    body: data ? JSON.stringify(data) : undefined,
    headers
  });

  return response;
};

export default customInstance;

// @ts-expect-error typescript-eslint/no-unused-vars
export type ErrorType<T> = Error;
export type BodyType<T> = T;
