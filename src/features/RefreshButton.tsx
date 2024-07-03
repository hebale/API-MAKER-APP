import React from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { RefreshButtonProps } from '~/types/features';

const RefreshButton = ({ title, onClick, disabled }: RefreshButtonProps) => {
  return (
    <IconButton disabled={disabled} disableRipple={true} onClick={onClick}>
      <Stack sx={{ alignItems: 'center' }}>
        <RefreshIcon />
        {title && <Typography sx={{ fontSize: '0.6rem' }}>{title}</Typography>}
      </Stack>
    </IconButton>
  );
};

export default RefreshButton;
