import { useContext } from 'react';
import { ModalDispatchContext } from '~/contexts/ModalContext';

import type { ModalProps } from '~/types/features';

const useModal = () => {
  const { open, close } = useContext(ModalDispatchContext);
  const openModal = (modal: ModalProps) =>
    open({ id: new Date().getTime(), ...modal });
  const closeModal = (id: number) => close(id);

  return { openModal, closeModal };
};

export default useModal;
