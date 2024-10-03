import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany, createCompany } from 'store/features';

const CompanyPage: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectCompany);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const notFound = status === 'failed' && error?.status === 404;
  const notAllowed = status === 'failed' && error?.status === 403;
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputError, setInputError] = React.useState<string | null>(null);

  const getCompany = async (): Promise<void> => {
    dispatch(fetchCompany());
  };

  const handleClose = (): void => {
    setShowSnackbar(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);

    if (inputError) {
      setInputError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!inputValue) {
      setInputError('Company name is required');

      return;
    }

    dispatch(createCompany(inputValue));
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getCompany();
    } else if (notFound) {
      setShowSnackbar(true);
    } else if (notAllowed) {
      setInputError(`You don't have the permission. Please contact your administrator.`);
    }
  }, [status, error]);

  return (
    <Box>
      {/* TODO: move snackbar and text field to a shared component */}
      <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleClose} message="Company does not exist" />
      <Typography variant="h6" sx={{ my: 2 }}>
        Step 1: Create a Company
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          required
          label="Enter Company name"
          variant="outlined"
          margin="normal"
          value={inputValue}
          onChange={handleInputChange}
          error={!!inputError}
        />
        <FormHelperText error>{inputError}</FormHelperText>
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyPage;
