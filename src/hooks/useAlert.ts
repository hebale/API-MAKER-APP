import { useContext } from 'react';
import { AlertDispatchContext } from '~/contexts/AlertContext';

import type { AlertProps } from '~/types/features';

const useAlert = () => {
  const { open, close } = useContext(AlertDispatchContext);
  const openAlert = (alert: AlertProps) =>
    open({ id: new Date().getTime(), ...alert });

  const closeAlert = (id: number) => close(id);

  return { openAlert, closeAlert };
};

export default useAlert;
