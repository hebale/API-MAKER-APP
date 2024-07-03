import http from '~/api/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '~/api/key';
import useAlert from '~/hooks/useAlert';
import { deepClone } from '~/utils';
import type { ApiParam, ApiData, Error } from '~/api';

export const deleteApi = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (param: Pick<ApiParam, 'path'> & { callback?: () => void }) =>
      http.delete('/api/v1/json', { body: { path: param.path } }),
    onMutate: async (param: Pick<ApiParam, 'path'>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path } = param;
        return origin.filter((api) => api.path !== path);
      });

      return { origin };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    onError: (err: Error, _, context) => {
      queryClient.setQueryData(queryKeys.all, context?.origin);
      openAlert({
        type: 'error',
        message: `오류가 발생했습니다.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSuccess: (_, param) => {
      const { callback } = param;
      callback && callback();

      openAlert({
        type: 'success',
        message: 'API가 삭제 되었습니다.',
      });
    },
  });
};

export const deleteApiHeader = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (param: ApiParam) =>
      http.delete('/api/v1/json/headers', { body: param }),
    onMutate: async (param: ApiParam) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key } = param;
        return origin.map((api) => {
          if (api.path !== path) {
            api.headers = [
              ...api.headers.slice(0, key as number),
              ...api.headers.slice((key as number) + 1),
            ];
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

export const deleteApiMethod = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (param: ApiParam) =>
      http.delete('/api/v1/json/methods', { body: param }),
    onMutate: async (param: ApiParam) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key } = param;

        return deepClone(origin).map((api: ApiData) => {
          if (api.path === path) {
            delete api.methods[key as string];
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
    onSettled: (data, error, variables) => {
      const { path } = variables;
      // queryClient.invalidateQueries({ queryKey: queryKeys.all });
      // queryClient.invalidateQueries({ queryKey: queryKeys.api(path) });
    },
  });
};
