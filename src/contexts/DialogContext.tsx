import { createContext, useState } from 'react';
import Dialogs from '~/features/Dialogs';

import type { ReactNode } from 'react';
import type { DialogProps, DialogDispatchAction } from '~/types/features';

export const DialogStatusContext = createContext<DialogProps[]>([]);
export const DialogDispatchContext = createContext<DialogDispatchAction>({
  open: () => {},
  close: () => {},
});

const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<DialogProps[]>([]);

  const dispatch: DialogDispatchAction = {
    open: (dialog) => {
      setDialogs((dialogs) => [
        ...dialogs.filter((dialog) => dialog.open),
        dialog,
      ]);
    },
    close: (id) => {
      setDialogs((dialogs) =>
        dialogs.map((dialog) => {
          if (dialog.id === id) dialog.open = false;
          return dialog;
        })
      );
    },
  };

  return (
    <DialogDispatchContext.Provider value={dispatch}>
      <DialogStatusContext.Provider value={dialogs}>
        {children}
        <Dialogs />
      </DialogStatusContext.Provider>
    </DialogDispatchContext.Provider>
  );
};

export default DialogProvider;
