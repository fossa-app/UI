import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DoneIcon from '@mui/icons-material/Done';
import { AppUser, Employee, ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';
import Page, { PageTitle } from 'components/Page';

interface EmployeeDetailsFormProps {
  title: string;
  loading: boolean;
  userProfile?: AppUser['profile'];
  error?: ErrorResponse;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: Employee) => void;
}

type EmployeeFormData = Partial<Record<keyof Employee, string>>;

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({ title, error, loading, userProfile, onSubmit }) => {
  const [formErrors, setFormErrors] = React.useState<EmployeeFormData>({});
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [formData, setFormData] = React.useState<Employee>({
    firstName: userProfile?.given_name ?? '',
    lastName: userProfile?.family_name ?? '',
    fullName: userProfile?.name ?? '',
  });

  const handleClose = () => {
    setShowSnackbar(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const formValidationErrors: EmployeeFormData = {};

    if (!formData.firstName) {
      formValidationErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName) {
      formValidationErrors.lastName = 'Last Name is required';
    }

    setFormErrors(formValidationErrors);

    return Object.keys(formValidationErrors).length === 0;
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  React.useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  return (
    <Box>
      {/* TODO: remove not found message */}
      <Snackbar type="error" open={showSnackbar} message={error?.title} onClose={handleClose} />
      <Page>
        <PageTitle>{title}</PageTitle>
      </Page>
      <Box component="form" noValidate onSubmit={onFormSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <TextField
            fullWidth
            required
            label="First Name"
            name="firstName"
            value={formData.firstName}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            required
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            onChange={handleInputChange}
          />
          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton type="submit" loadingPosition="end" variant="contained" loading={loading} endIcon={<DoneIcon />}>
            Finish
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeDetailsForm;
