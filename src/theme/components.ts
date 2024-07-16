import { colorSet } from './color';

const {
  $pointColor,
  $primaryColor,
  $primaryVariant,
  $secondaryColor,
  $secondaryVariant,
  $background,
} = colorSet;

export default {
  MuiTabs: {
    styleOverrides: {
      root: {
        zIndex: 10,
        position: 'relative',
        bottom: -1,
        minHeight: '32px',
      },
      flexContainer: {
        zIndex: 1,
        position: 'relative',
      },
      indicator: {
        zIndex: 0,
        marginBottom: -1,
        height: '32px',
        border: `1px solid ${$secondaryColor}`,
        borderBottomColor: $background,
        borderRadius: '4px 4px 0 0',
        background: $secondaryVariant,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        padding: 0,
        minHeight: '34px',
        minWidth: '80px',
        fontSize: '0.65rem',
        textTransform: 'capitalize',
      },
    },
  },
  MuiTabPanel: {
    styleOverrides: {
      root: {
        position: 'relative',
        padding: 0,
        border: `1px solid ${$secondaryColor}`,
        borderRadius: '4px',
      },
    },
  },
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
