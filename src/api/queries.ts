import http from './http';
import { useQuery, QueriesOptions } from '@tanstack/react-query';
import queryKeys from './key';

import type { ApiData } from '~/types/components';

export const getAllApis = () =>
  useQuery({
    queryKey: queryKeys.all,
    queryFn: async () => {
      const response = await http.get('/all');
      if (response?.code === 200) return response.data as ApiData[];
    },
  });

export const getApiList = () =>
  useQuery({
    queryKey: queryKeys.list,
    queryFn: async () => {
      const response = await http.get('/list');
      if (response?.code === 200) return response.data as string[];
    },
  });

export const getApi = (path: string, options?: QueriesOptions) =>
  useQuery({
    queryKey: queryKeys.api(path),
    queryFn: async () => {
      const response = await http.get(`?path=${path}`);
      if (response?.code === 200) return response.data as ApiData;
    },
    ...options,
  });
