import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { selectCompany, createCompany, selectIsUserAdmin, fetchCompany } from 'store/features';
import Snackbar from 'shared/components/Snackbar';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const CompanyPage: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectCompany);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const notFound = status === 'failed' && error?.status === 404;

  const handleClose = (): void => {
    setShowSnackbar(false);
  };

  const handleSubmit = (value: string): void => {
    dispatch(createCompany(value));
  };

  const getCompany = async (): Promise<void> => {
    dispatch(fetchCompany());
  };

  React.useEffect(() => {
    if (notFound) {
      setShowSnackbar(true);
    }
  }, [notFound]);

  React.useEffect(() => {
    if (status === 'idle') {
      getCompany();
    }
  }, [status]);

  return (
    <Box>
      {/* TODO: move text field to a shared component */}
      <Snackbar type="error" open={showSnackbar} message="Company does not exist" onClose={handleClose} />
      <CompanyDetailsForm
        isAdmin={isUserAdmin}
        title="Create a Company"
        label="Enter Company name"
        validationMessage="Company name is required"
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default CompanyPage;
