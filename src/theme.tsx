import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#303A47',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#303A47',
        },
      },
    },
  },
});
export default theme;