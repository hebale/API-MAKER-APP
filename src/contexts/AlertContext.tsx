import { createContext, useState } from 'react';
import Alerts from '~/features/Alerts';

import type { ReactNode } from 'react';
import type { AlertProps, AlertDispatchProps } from '~/types/features';

export const AlertStatusContext = createContext<AlertProps[]>([]);
export const AlertDispatchContext = createContext<AlertDispatchProps>({
  open: () => {},
  close: () => {},
});

const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const dispatch: AlertDispatchProps = {
    open: (alert) => {
      setAlerts((alerts) => [...alerts, alert]);
    },
    close: (id) => {
      setAlerts((alerts) => alerts.filter((alert) => alert.id !== id));
    },
  };

  return (
    <AlertDispatchContext.Provider value={dispatch}>
      <AlertStatusContext.Provider value={alerts}>
        {children}
        <Alerts />
      </AlertStatusContext.Provider>
    </AlertDispatchContext.Provider>
  );
};

export default AlertProvider;
