import http from '~/api/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '~/api/key';
import useAlert from '~/hooks/useAlert';
import { deepClone } from '~/utils';
import type {
  ApiParam,
  ApiData,
  Header,
  Method,
  Pipeline,
  Response,
  Error,
} from '~/api';

export const patchApiPath = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<string>) =>
      http.patch('/path', { body: params }),
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
    onSuccess: () => {
      openAlert({
        type: 'success',
        message: 'Path 수정이 완료되었습니다.',
      });
    },
  });
};

export const patchApiHeader = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Header>) =>
      http.patch('/headers', { body: params }),
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
    onSuccess: () => {
      // openAlert({
      //   type: 'success',
      //   message: 'Headers 수정이 완료되었습니다.',
      // });
    },
  });
};

export const patchApiMethod = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Method>) =>
      http.patch('/methods', { body: params }),
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
    onSuccess: () => {
      openAlert({
        type: 'success',
        message: 'Method 수정이 완료되었습니다.',
      });
    },
  });
};

export const patchApiPipeline = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Pipeline>) =>
      http.patch('/pipeline', { body: params }),
    onMutate: async (params: ApiParam<Pipeline>) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.all });
      const origin = queryClient.getQueryData(queryKeys.all);

      queryClient.setQueryData(queryKeys.all, (origin: ApiData[]) => {
        const { path, key, data } = params;

        return origin.map((api) => {
          if (api.path === path) {
            api.pipeline[key as string] = data;
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
      queryClient.invalidateQueries({ queryKey: queryKeys.api(path) });
    },
    onSuccess: () => {
      openAlert({
        type: 'success',
        message: 'Pipeline 수정이 완료되었습니다.',
      });
    },
  });
};

export const patchApiResponse = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlert();

  return useMutation({
    mutationFn: (params: ApiParam<Response>) =>
      http.patch('/response', { body: params }),
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
    onSuccess: () => {
      openAlert({
        type: 'success',
        message: 'Response 저장이 완료되었습니다.',
      });
    },
  });
};
