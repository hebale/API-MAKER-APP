import http from './http';
import { useQuery, QueriesOptions } from '@tanstack/react-query';
import queryKeys from './key';

import type { ApiData } from '~/types/components';

export const getAllApis = () =>
  useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => {
      const response = await http.get('/api/v1/json/all');
      if (response?.code === 200) return response.data as ApiData[];
    },
  });

export const getApiList = () =>
  useQuery({
    queryKey: queryKeys.list,
    queryFn: async () => {
      const response = await http.get('/api/v1/json/list');
      if (response?.code === 200) return response.data as string[];
    },
  });

export const getApi = (path: string, options?: QueriesOptions) => {
  return useQuery({
    queryKey: queryKeys.api(path),
    queryFn: async () => {
      const response = await http.get(`/api/v1/json?path=${path}`);
      if (response?.code === 200) return response.data as ApiData;
    },
    ...options,
  });
};

export const getJsonMethos = async ({
  path,
  method,
}: {
  [key: string]: string;
}) => {
  const response = await http.get(
    `/api/v1/json/method?path=${path}&method=${method}`
  );
  if (response?.code === 200) return response;
};

export const putJson = async (params: any) => {
  const response = await http.put('/api/v1/json', { body: params });
  if (response?.code === 200) return response;
};
