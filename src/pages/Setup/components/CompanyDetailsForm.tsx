import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MESSAGES } from 'shared/constants';
import { ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';
import PageTitle from 'components/PageTitle';

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
      setInputError(MESSAGES.error.general.permission);
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
      <PageTitle>{title}</PageTitle>
      <Box component="form" noValidate onSubmit={onFormSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          name="name"
          required={isAdmin}
          disabled={!isAdmin}
          label={label}
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton
            type="submit"
            variant="contained"
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
