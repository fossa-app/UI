import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

interface CompanyDetailsFormProps {
  title: string;
  label: string;
  validationMessage: string;
  isAdmin: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: string) => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({ title, label, isAdmin, validationMessage, onSubmit }) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [inputError, setInputError] = React.useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);

    if (inputError) {
      setInputError(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
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
      setInputError(`You don't have the necessary permissions. Please reach out to your administrator for support.`);
    }
  }, [isAdmin]);

  return (
    <>
      <Typography align="center" variant="h6" sx={{ my: 2 }}>
        {title}
      </Typography>
      <Box component="form" onSubmit={onFormSubmit} noValidate>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          required={isAdmin}
          disabled={!isAdmin}
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          error={!!inputError}
        />
        <FormHelperText error>{inputError}</FormHelperText>
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={!isAdmin}>
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CompanyDetailsForm;
