import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { APP_CONFIG } from 'shared/constants';
import { ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';

interface CompanyDetailsFormProps {
  title: string;
  label: string;
  validationMessage: string;
  isAdmin: boolean;
  loading: boolean;
  error?: ErrorResponse;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (name: string) => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ title, label, isAdmin, validationMessage, error, loading, onSubmit }) => {
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

    if (!isAdmin) {
      return;
    }

    if (!inputValue) {
      setInputError(validationMessage);

      return;
    }

    onSubmit(inputValue);
  };

  React.useEffect(() => {
    if (!isAdmin) {
      setInputError(APP_CONFIG.errorMessages.permission);
    }
  }, [isAdmin]);

  React.useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  return (
    <Box>
      <Snackbar type="error" open={showSnackbar} message={error?.title} onClose={handleClose} />
      <Typography align="center" variant="h6" sx={{ my: 5 }}>
        {title}
      </Typography>
      <Box component="form" noValidate onSubmit={onFormSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          name="name"
          required={isAdmin}
          disabled={!isAdmin}
          label={label}
          value={inputValue}
          error={!!inputError}
          onChange={handleInputChange}
        />
        {inputError && <FormHelperText error>{inputError}</FormHelperText>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton
            type="submit"
            variant="outlined"
            loadingPosition="end"
            loading={loading}
            disabled={!isAdmin}
            endIcon={<NavigateNextIcon />}
          >
            Next
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyDetailsForm;
