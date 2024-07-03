import { createContext, useState } from 'react';
import Modals from '~/features/Modals';

import type { ReactNode } from 'react';
import type { ModalProps, ModalDispatchProps } from '~/types/features';

export const ModalStatusContext = createContext<ModalProps[]>([]);
export const ModalDispatchContext = createContext<ModalDispatchProps>({
  open: (modal: ModalProps) => {},
  close: () => {},
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalProps[]>([]);

  const dispatch: ModalDispatchProps = {
    open: (modal) => {
      return new Promise((resolve) =>
        setModals((modals) => [...modals, { ...modal, resolve }])
      );
    },
    close: (id) => {
      setModals((modals) => modals.filter((modal) => modal.id !== id));
    },
  };

  return (
    <ModalDispatchContext.Provider value={dispatch}>
      <ModalStatusContext.Provider value={modals}>
        {children}
        <Modals />
      </ModalStatusContext.Provider>
    </ModalDispatchContext.Provider>
  );
};

export default ModalProvider;
