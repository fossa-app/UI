import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { Branch } from 'shared/models';

interface BrachDetailsFormProps {
  data: Branch | null;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Branch) => void;
}

const BrachDetailsForm: React.FC<BrachDetailsFormProps> = ({ data, loading, onSubmit }) => {
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
    <Box component="form" noValidate onSubmit={onFormSubmit}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
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
  );
};

export default BrachDetailsForm;
