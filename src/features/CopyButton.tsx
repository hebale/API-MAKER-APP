import { Stack, IconButton, Typography } from '@mui/material';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import type { CopyButtonProps } from '~/types/features';

const CopyButton = ({
  title,
  data,
  disabled,
  onSuccess,
  onError,
}: CopyButtonProps) => {
  const onCopyClipboard = (data: string) => {
    try {
      navigator.clipboard.writeText(data);
      onSuccess && onSuccess();
    } catch (err) {
      let msg = 'Unknown Error';
      if (err instanceof Error) msg = err.message;
      onError && onError(msg);
    }
  };

  return (
    <IconButton
      className="copy-button"
      disabled={disabled}
      disableRipple={true}
      onClick={() => data && onCopyClipboard(data)}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <CopyAllIcon />
        {title && <Typography sx={{ fontSize: '0.6rem' }}>{title}</Typography>}
      </Stack>
    </IconButton>
  );
};

export default CopyButton;
