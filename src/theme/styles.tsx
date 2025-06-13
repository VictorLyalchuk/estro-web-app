// import { makeStyles, createStyles } from '@material-ui/core/styles';

// export const useStyles = makeStyles((theme) =>
//     createStyles({
//         root: {
//             display: 'flex',
//             flexWrap: 'wrap',
//         },
//         margin: {
//             margin: theme.spacing(0),
//         },
//         input: {},
//         button: {
//             textTransform: 'none',
//             marginBottom: "3px"
//         },
//         button2: {
//             height: '80px',
//             transition: 'transform 300ms ease-in-out',
//             '&:hover': {
//                 transform: 'scale(1.1)',
//             },
//         },
//         withoutLabel: {
//             marginTop: theme.spacing(3),
//         },
//         textField: {
//             '& .MuiInputBase-root': {
//                 height: '60px',
//             },
//         },
//         googleButton: {
//             textTransform: 'none',
//             backgroundColor: '#4285F4',
//             color: '#fff',
//             '&:hover': {
//                 backgroundColor: '#357ae8',
//             },
//             margin: theme.spacing(1, 0),
//         },
//         fullWidth: {
//             width: '100%',
//         },
//     }),
// );

import { Theme } from '@mui/material/styles';

export const useStyles = (theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(0),
  },
  button: {
    textTransform: 'none',
    marginBottom: 3,
    color: '#fff',
  },
  button2: {
    height: 80,
    transition: 'transform 300ms ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    '& .MuiInputBase-root': {
      height: 60,
    },
  },
  googleButton: {
    textTransform: 'none',
    backgroundColor: '#4285F4',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#357ae8',
    },
    margin: theme.spacing(1, 0),
  },
  fullWidth: {
    width: '100%',
  },
});