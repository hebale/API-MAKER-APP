import { useContext } from 'react';
import { DialogDispatchContext } from '~/contexts/DialogContext';

import type { DialogProps } from '~/types/features';

const useDialog = () => {
  const { open, close } = useContext(DialogDispatchContext);
  const openDialog = (dialog: DialogProps) => {
    open({ id: new Date().getTime(), open: true, ...dialog });
  };

  const closeDialog = (id: number) => close(id);

  return { openDialog, closeDialog };
};

export default useDialog;
