import { RouterProvider } from 'react-router-dom';
import { Box } from '@mui/material';
import router from '~/router';

const Layout = () => (
  <RouterProvider router={router} fallbackElement={<Box>what's wrong!?</Box>} />
);

export default Layout;
