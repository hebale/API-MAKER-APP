import { useState, createContext } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Ribbon from './Ribbon';
import Form from './Form';
import type { ApiData } from '~/types/components';

export type ApiDispatchProps = {
  update: (value: ApiData) => void;
};

export const ApiContext = createContext<ApiData | {}>({});
export const ApiDispatchContext = createContext<ApiDispatchProps>({
  update: (value) => {},
});

const PipelineBox = () => {
  const [api, setApi] = useState<ApiData | {}>({});

  const dispatch = {
    reset: () => setApi({}),
    update: (api: ApiData) => {
      setApi((prev) => ({ ...prev, ...api }));
    },
  };

  return (
    <Box className="api-pipeline">
      <Stack>
        <Typography>Pipeline 관리</Typography>
      </Stack>

      <ApiDispatchContext.Provider value={dispatch}>
        <ApiContext.Provider value={api}>
          <Ribbon />
          <Form />
        </ApiContext.Provider>
      </ApiDispatchContext.Provider>
    </Box>
  );
};

export default PipelineBox;
