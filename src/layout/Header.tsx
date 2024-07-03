import React from 'react';
import { Stack } from '@mui/material';

const Header = ({ children }) => {
  return (
    <Stack
      id="header"
      component="header"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Stack>
  );
};

export default Header;
