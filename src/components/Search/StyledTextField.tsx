import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const StyledTextField = styled(TextField)(({ theme }) => {
  const {
    palette: {
      primary: { contrastText },
    },
    breakpoints,
  } = theme;

  return {
    '& label.Mui-focused': {
      color: contrastText,
    },
    '& .MuiInputLabel-root': {
      color: contrastText,
    },
    '& .MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error):before': {
      borderBottomColor: contrastText,
    },
    '& .MuiInputBase-root:before': {
      borderBottomColor: contrastText,
    },
    '& .MuiInputBase-root:after': {
      borderBottomColor: contrastText,
    },
    '& .MuiInputBase-input': {
      color: contrastText,
    },
    [breakpoints.down('sm')]: {
      width: '200px',
    },
  };
});
