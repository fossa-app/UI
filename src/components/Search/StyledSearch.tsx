import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export const StyledTextField = styled(TextField)(({ theme }) => {
  const { contrastText } = theme.palette.primary;

  return {
    '& label.Mui-focused': {
      color: contrastText,
    },
    '& .MuiInputLabel-root': {
      color: contrastText,
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: contrastText,
    },
    '& .MuiInputBase-input': {
      color: contrastText,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: contrastText,
      },
      '&:hover fieldset': {
        borderColor: contrastText,
      },
      '&.Mui-focused fieldset': {
        borderColor: contrastText,
      },
    },
  };
});
