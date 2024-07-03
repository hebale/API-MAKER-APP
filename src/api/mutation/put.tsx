import http from '~/api/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '~/api/key';
import useAlert from '~/hooks/useAlert';
import type { ApiParam, ApiData, Header, Method, Error } from '~/api';

type putApiProp = {
  path: string;
  data: ApiData;
  callback?: () => void;
};

export const putApi = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (param: putApiProp) => http.put('api/v1/json', { body: param }),
    onMutate: async (param: putApiProp) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) =>
        origin.map((api) => {
          if (api.path === param.path) return param.data;
          return api;
        })
      );

      return { origin };
    },
    onSettled: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.api(args[2].path) });
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
        message: 'API가 수정 되었습니다.',
      });
    },
  });
};

export const putApiHeader = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Header>) =>
      http.put('/api/v1/json/headers', { body: params }),
    onMutate: async (params: ApiParam<Header>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path && api) {
            api.headers = [
              ...api.headers.slice(0, key as number),
              data,
              ...api.headers.slice((key as number) + 1),
            ] as Header[];
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
        message: `오류가 발생했습니다. 다시 시도해 주세요.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
};

export const putApiMethod = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Method>) =>
      http.put('/api/v1/json/methods', { body: params }),
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
        message: `오류가 발생했습니다. 다시 시도해 주세요.\nstatus: ${err.status}\nmessage: ${err.message}`,
      });
    },
    onSettled: (data, error, variables) => {
      const { path } = variables;
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.api(path) });
    },
  });
};

export const putApiPipeline = () => {};
