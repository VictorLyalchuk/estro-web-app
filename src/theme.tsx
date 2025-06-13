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
          // color: '#fff', 
          color: '#303A47',
        },
        // contained: {
        //   backgroundColor: '#303A47',
        //   '&:hover': {
        //     backgroundColor: '#303A47',
        //   },
        // },
      },
    },
  },
});
export default theme;


// import { createTheme } from '@material-ui/core/styles';
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#303A47', 
//     },
//   },
//   overrides: {
//     MuiButton: {
//       root: {
//         color: '#303A47', 
//       },
//       contained: {
//         backgroundColor: '#303A47', 
//         '&:hover': {
//           backgroundColor: '#303A47', 
//         },
//       },
//     },
//   },
// });

// export default theme;