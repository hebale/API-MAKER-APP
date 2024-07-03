export default {
  MuiContainer: {
    styleOverrides: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 !important',
        height: '100%',
        '& #contents': {
          flexGrow: 1,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        padding: '0 4px',
        height: '22px',
        borderRadius: '4px',
      },
      label: {
        padding: 0,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        border: '1px solid #ddd',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        padding: '4px',
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        padding: '6px 8px',
        input: {
          padding: 0,
        },
        background: '#fff',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        padding: '6px 8px',
      },
    },
  },
  MuiSelectBase: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  // ApiBox
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: 0,
        borderBottom: '1px solid #eee',
      },
      content: {
        margin: 0,
        justifyContent: 'space-between',
        '&.Mui-expanded': {
          margin: 0,
          minHeight: 0,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: {
        '.MuiDialogTitle-root': {
          paddingBottom: 0,
        },
      },
    },
  },
};
