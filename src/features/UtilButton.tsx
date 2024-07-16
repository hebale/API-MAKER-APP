import { Stack, IconButton, Typography } from '@mui/material';
import type { UtilButtonProps } from '~/types/features';

const UtilButton = ({ title, icon, onClick, disabled }: UtilButtonProps) => {
  return (
    <IconButton disabled={disabled} disableRipple={true} onClick={onClick}>
      <Stack sx={{ alignItems: 'center' }}>
        {icon && icon}
        {title && <Typography sx={{ fontSize: '0.6rem' }}>{title}</Typography>}
      </Stack>
    </IconButton>
  );
};

export default UtilButton;
