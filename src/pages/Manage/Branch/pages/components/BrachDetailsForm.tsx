import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import SaveIcon from '@mui/icons-material/Save';
import { Branch } from 'shared/models';
import LinearLoader from 'components/UI/LinearLoader';

interface BrachDetailsFormProps {
  data: Branch | null;
  formLoading: boolean;
  buttonLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Branch) => void;
}

const BrachDetailsForm: React.FC<BrachDetailsFormProps> = ({ data, formLoading, buttonLoading, onSubmit }) => {
  const [formData, setFormData] = React.useState<Branch>({
    name: data?.name ?? '',
  });
  const [inputError, setInputError] = React.useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: event.target.value });

    if (inputError) {
      setInputError(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name) {
      setInputError('Branch name is required');

      return;
    }

    onSubmit(formData);
  };

  React.useEffect(() => {
    if (data) {
      setFormData({ name: data.name });
    }
  }, [data]);

  return (
    /* TODO: create a generic form component */
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: 6, position: 'relative' }}>
      <Box
        noValidate
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative' }}
        onSubmit={onFormSubmit}
      >
        <Grid container spacing={4} sx={{ flexGrow: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              data-cy="branch-name-input"
              variant="outlined"
              name="name"
              label="Enter Branch name"
              value={formData.name}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
                },
              }}
              error={!!inputError}
              onChange={handleInputChange}
            />
            {inputError && (
              <FormHelperText error data-cy="branch-name-input-validation">
                {inputError}
              </FormHelperText>
            )}
          </Grid>
          {/* Test field */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth data-cy="branch-address-input" variant="outlined" name="address" label="Enter Branch address" />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton
            data-cy="save-branch-button"
            type="submit"
            variant="contained"
            loadingPosition="end"
            loading={buttonLoading}
            endIcon={<SaveIcon />}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      <LinearLoader open={formLoading} />
    </Paper>
  );
};

export default BrachDetailsForm;
