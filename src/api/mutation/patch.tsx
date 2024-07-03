import http from '~/api/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '~/api/key';
import useAlert from '~/hooks/useAlert';
import { deepClone } from '~/utils';
import type { ApiParam, ApiData, Header, Method, Response, Error } from '~/api';

export const patchApiPath = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<string>) =>
      http.patch('/api/v1/json/path', { body: params }),
    onMutate: async (params: ApiParam<string>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = deepClone(queryClient.getQueryData(queryKeys.all));

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            api.path = data;
          }
          return api;
        });
      });

      console.dir(origin);

      return { origin };
    },
    onError: (err: Error, _, context) => {
      queryClient.setQueryData(queryKeys.all, context?.origin);

      openAlert({
        type: 'error',
        message: `오류가 발생했습니다.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const patchApiHeader = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Header>) =>
      http.patch('/api/v1/json/headers', { body: params }),
    onMutate: async (params: ApiParam<Header>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = deepClone(queryClient.getQueryData(queryKeys.all));

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            api.headers = [
              ...api.headers.slice(0, key as number),
              data,
              ...api.headers.slice((key as number) + 1),
            ] as Header[];
          }
          return api;
        });
      });

      console.dir(origin);

      return { origin };
    },
    onError: (err: Error, _, context) => {
      queryClient.setQueryData(queryKeys.all, context?.origin);

      openAlert({
        type: 'error',
        message: `오류가 발생했습니다.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const patchApiMethod = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Method>) =>
      http.patch('/api/v1/json/methods', { body: params }),
    onMutate: async (params: ApiParam<Method>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            api.methods[key as string] = data;
          }
          return api;
        });
      });

      return { origin };
    },
    onError: (err: Error, _, context) => {
      queryClient.setQueryData(queryKeys.all, context?.origin);
      openAlert({
        type: 'error',
        message: `오류가 발생했습니다.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const patchApiResponse = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Response>) =>
      http.patch('/api/v1/json/response', { body: params }),
    onMutate: async (params: ApiParam<Response>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            api.response = data;
          }
          return api;
        });
      });

      return { origin };
    },
    onError: (err: Error, _, context) => {
      queryClient.setQueryData(queryKeys.all, context?.origin);
      openAlert({
        type: 'error',
        message: `오류가 발생했습니다.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      openAlert({ type: 'success', message: '저장 되었습니다' });
    },
  });
};
