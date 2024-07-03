import React from 'react';
import { Stack, Typography } from '@mui/material';
import Viewer from '~/features/Viewer';

const Result = ({ data }) => {
  return (
    <Stack>
      <Typography>result</Typography>
      <Viewer value={data} />
    </Stack>
  );
};

export default Result;
