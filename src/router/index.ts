import { createBrowserRouter } from 'react-router-dom';
import Main from '~/layout/Main';

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    Component: Main,
  },
]);

export default router;
