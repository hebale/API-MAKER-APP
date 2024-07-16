import { Stack, Switch, FormControlLabel } from '@mui/material';
import type { ChangeEvent } from 'react';

export type SwitchButtonProps = {
  title?: string;
  checked: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any;
};

const SwitchButton = ({ title, checked, onChange }: SwitchButtonProps) => {
  return (
    <Stack className="switch">
      <FormControlLabel
        disableTypography={!title}
        control={
          <Switch disableRipple={true} onChange={onChange} checked={checked} />
        }
        label={title ?? ''}
      />
    </Stack>
  );
};

export default SwitchButton;
