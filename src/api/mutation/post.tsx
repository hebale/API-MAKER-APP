import http from '~/api/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '~/api/key';
import useAlert from '~/hooks/useAlert';
import type { ApiParam, ApiData, Header, Error } from '~/api';

export const postApi = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (param: ApiData) => http.post('/api/v1/json', { body: param }),
    onMutate: async (param: ApiData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => [
        ...origin,
        param.data,
      ]);

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
      queryClient.invalidateQueries({ queryKey: queryKeys.list });
    },
  });
};

export const postApiHeader = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Header[]>) =>
      http.post('api/v1/json/headers', { body: params }),
    onMutate: async (params: ApiParam<Header[]>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            return {
              ...api,
              headers: [
                ...api.headers.slice(0, key as number),
                ...data,
                ...api.headers.slice(key as number),
              ] as Header[],
            };
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
