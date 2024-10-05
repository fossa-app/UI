import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, fetchBranches, selectBranches, selectIsUserAdmin } from 'store/features';
import Snackbar from 'shared/components/Snackbar';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const BranchesPage: React.FC<{}> = () => {
  const { status, error } = useAppSelector(selectBranches);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const dispatch = useAppDispatch();
  const notFound = status === 'failed' && error?.status === 500; // TODO: change to 404
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleClose = (): void => {
    setShowSnackbar(false);
  };

  const getBranches = async (): Promise<void> => {
    dispatch(fetchBranches({ pageNumber: 1, pageSize: 1 }));
  };

  const handleSubmit = (value: string): void => {
    dispatch(createBranch(value));
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getBranches();
    }
  }, [status]);

  React.useEffect(() => {
    if (notFound) {
      setShowSnackbar(true);
    }
  }, [notFound]);

  return (
    <Box>
      {/* TODO: move text field to a shared component */}
      <Snackbar type="error" open={showSnackbar} message={error?.title} onClose={handleClose} />
      <CompanyDetailsForm
        isAdmin={isUserAdmin}
        title="Create a Branch"
        label="Enter Branch name"
        validationMessage="Branch name is required"
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default BranchesPage;
