import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import DoneIcon from '@mui/icons-material/Done';
import { APP_CONFIG } from 'shared/constants';
import { AppUser, Employee, ErrorResponse } from 'shared/models';
import Snackbar from 'components/UI/Snackbar';

interface EmployeeDetailsFormProps {
  title: string;
  isAdmin: boolean;
  loading: boolean;
  userProfile?: AppUser['profile'];
  error?: ErrorResponse;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (value: Employee) => void;
}

type EmployeeFormData = Partial<Record<keyof Employee, string>>;

const EmployeeDetailsForm: React.FC<EmployeeDetailsFormProps> = ({ title, isAdmin, error, loading, userProfile, onSubmit }) => {
  const [formErrors, setFormErrors] = React.useState<EmployeeFormData>({});
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [permissionError, setPermissionError] = React.useState<string | null>(null);
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

    if (!isAdmin) {
      return;
    }

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  React.useEffect(() => {
    if (!isAdmin) {
      setPermissionError(APP_CONFIG.errorMessages.permission);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            required={isAdmin}
            disabled={!isAdmin}
            value={formData.firstName}
            error={!!formErrors.firstName}
            helperText={formErrors.firstName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            required={isAdmin}
            disabled={!isAdmin}
            value={formData.lastName}
            error={!!formErrors.lastName}
            helperText={formErrors.lastName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            disabled={!isAdmin}
            onChange={handleInputChange}
          />
        </Box>
        {permissionError && <FormHelperText error>{permissionError}</FormHelperText>}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <LoadingButton
            type="submit"
            loadingPosition="end"
            variant="outlined"
            loading={loading}
            disabled={!isAdmin}
            endIcon={<DoneIcon />}
          >
            Finish
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeDetailsForm;
