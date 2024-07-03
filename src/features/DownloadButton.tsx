import React from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import type { DownloadButtonProps } from '~/types/features';

const DownloadButton = ({
  title,
  url,
  fileName = `json_api_${new Date().getTime()}`,
}: DownloadButtonProps) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${fileName}`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IconButton disableRipple={true} onClick={onClick}>
      <Stack sx={{ alignItems: 'center' }}>
        <DownloadIcon />
        {title && <Typography sx={{ fontSize: '0.6rem' }}>{title}</Typography>}
      </Stack>
    </IconButton>
  );
};

export default DownloadButton;
