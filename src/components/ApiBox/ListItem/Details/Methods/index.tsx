import { useCallback, useContext } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { debounce } from '~/utils';
import {
  patchApiMethod,
  putApiMethod,
  deleteApiMethod,
  patchApiPipeline,
} from '~/api';
import { ApiContext } from '~/components/ApiBox/ListItem';
import Method from './Method';
import type { ApiData } from '~/types/components';
import type { ExcludedMethodData } from './Method';

export type MethodProps = {
  data: ExcludedMethodData;
  onChange: (data: ExcludedMethodData) => void;
};

export type MethodData = {
  isActive: boolean;
  name: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  delay: number;
  status: number;
};

const methodNames = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

const Methods = () => {
  const { path, methods, pipeline } = useContext(ApiContext) as ApiData;
  const { mutate: patchMethodMutate } = patchApiMethod();
  const { mutate: putMethodMutate } = putApiMethod();
  const { mutate: deleteMethodMutate } = deleteApiMethod();
  const { mutate: patchPipelineMutate } = patchApiPipeline();

  const onDebounceMutate = useCallback(
    debounce(
      (params, mutate: typeof patchMethodMutate) => mutate(params),
      1500
    ),
    []
  );

  const onChange = (data: ExcludedMethodData) => {
    const {
      isActive,
      name: method,
      delay,
      status,
      pipeline: pipelineStatus,
    } = data;

    /* Data Remove */
    if (!isActive) return deleteMethodMutate({ path, key: method });

    /* Data Create */
    if (!methods.hasOwnProperty(method))
      return putMethodMutate({
        path,
        key: method,
        data: { delay: 0, status: 200 },
      });

    /* Data Update */
    if (!pipeline[method] || pipelineStatus !== pipeline[method].isActive) {
      patchPipelineMutate({
        path,
        key: method,
        data: { ...pipeline[method], isActive: pipelineStatus },
      });
    } else if (delay === methods[method].delay) {
      patchMethodMutate({
        path,
        key: method,
        data: { ...methods[method], status },
      });
    } else {
      onDebounceMutate(
        {
          path,
          key: method,
          data: { ...methods[method], delay },
        },
        patchMethodMutate
      );
    }
  };

  return (
    <Box className="api-methods">
      <Stack direction="row">
        <Typography>pipeline</Typography>
        <Typography>delay</Typography>
        <Typography>status</Typography>
      </Stack>
      {methodNames.map((name) => {
        const methodData: ExcludedMethodData = methods[name]
          ? {
              name,
              isActive: true,
              ...methods[name],
              pipeline: pipeline[name] ? pipeline[name].isActive : false,
            }
          : { name, isActive: false, delay: 0, status: 200, pipeline: false };

        return <Method key={name} data={methodData} onChange={onChange} />;
      })}
    </Box>
  );
};

export default Methods;
