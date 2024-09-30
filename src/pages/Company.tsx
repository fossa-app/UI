import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchCompany, selectCompany } from 'store/features';

const CompanyPage: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectCompany);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const getCompany = async (): Promise<void> => {
    dispatch(fetchCompany());
  };

  const handleClose = (): void => {
    setShowSnackbar(false);
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getCompany();
    } else if (status === 'failed' && error?.status === 404) {
      // TODO: handle
      setShowSnackbar(true);
    }
  }, [status, error]);

  return (
    <Box>
      Company
      {/* TODO: move to shared components */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Company does not exist"
      />
    </Box>
  );
};

export default CompanyPage;
