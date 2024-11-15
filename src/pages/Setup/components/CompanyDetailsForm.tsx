import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { MESSAGES } from 'shared/constants';
import Page, { PageTitle } from 'components/UI/Page';

interface CompanyDetailsFormProps {
  title: string;
  label: string;
  validationMessage: string;
  isAdmin: boolean;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (name: string) => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ title, label, isAdmin, validationMessage, loading, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputError, setInputError] = React.useState<string | null>(null);

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

  return (
    <Box>
      <Page>
        <PageTitle>{title}</PageTitle>
      </Page>
      <Box component="form" noValidate onSubmit={onFormSubmit}>
        <TextField
          fullWidth
          data-cy="company-branch-input"
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
        {inputError && (
          <FormHelperText data-cy="company-branch-input-validation" error>
            {inputError}
          </FormHelperText>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton
            data-cy="setup-next-button"
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
