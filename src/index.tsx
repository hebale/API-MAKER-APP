import { createRoot } from 'react-dom/client';
import StyleProvider from '~/theme';
import QueryProvider from '~/contexts/QeuryContext';
import LogProvider from './contexts/LogContext';
import AlertProvider from '~/contexts/AlertContext';
import ModalProvider from '~/contexts/ModalContext';
import DialogProvider from '~/contexts/DialogContext';
import Layout from '~/layout';
import '~/assets/style.scss';

if (document.querySelector('#app') !== null) {
  createRoot(document.querySelector('#app') as HTMLElement).render(
    // <React.StrictMode>
    <QueryProvider>
      <StyleProvider>
        <LogProvider>
          <AlertProvider>
            <ModalProvider>
              <DialogProvider>
                <Layout />
              </DialogProvider>
            </ModalProvider>
          </AlertProvider>
        </LogProvider>
      </StyleProvider>
    </QueryProvider>
    // </React.StrictMode>
  );
}
