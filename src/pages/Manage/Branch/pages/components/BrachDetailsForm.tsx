import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';

interface BrachDetailsFormProps {
  loading: boolean;
  error?: ErrorResponse;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (name: string) => void;
}

const BrachDetailsForm: React.FC<BrachDetailsFormProps> = ({ error, loading, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputError, setInputError] = React.useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleClose = () => {
    setShowSnackbar(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);

    if (inputError) {
      setInputError(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue) {
      setInputError('Branch name is required');

      return;
    }

    onSubmit(inputValue);
  };

  React.useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  return (
    <Box>
      {error && <Snackbar type="error" open={showSnackbar} message={error.title} onClose={handleClose} />}
      {/* TODO: create a generic form component */}
      <Box component="form" noValidate onSubmit={onFormSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              variant="outlined"
              name="name"
              label="Enter Branch name"
              value={inputValue}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                },
              }}
              error={!!inputError}
              onChange={handleInputChange}
            />
            {inputError && <FormHelperText error>{inputError}</FormHelperText>}
          </Grid>
          {/* Test field */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth variant="outlined" name="address" label="Enter Branch address" />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton type="submit" variant="contained" loadingPosition="end" loading={loading} endIcon={<SaveIcon />}>
            Save
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default BrachDetailsForm;
