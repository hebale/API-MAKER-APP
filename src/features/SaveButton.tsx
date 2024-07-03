import { Stack, IconButton, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type { SaveButtonProps } from '~/types/features';

const SaveButton = ({ title, onClick, disabled }: SaveButtonProps) => {
  return (
    <IconButton disabled={disabled} disableRipple={true} onClick={onClick}>
      <Stack sx={{ alignItems: 'center' }}>
        <SaveIcon />
        {title && <Typography sx={{ fontSize: '0.6rem' }}>{title}</Typography>}
      </Stack>
    </IconButton>
  );
};

export default SaveButton;
