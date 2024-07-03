import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import palette from './palette';
import typography from './typography';
import components from './components';

const theme = createTheme({
  palette,
  typography,
  components,
});

const StyleProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default StyleProvider;
