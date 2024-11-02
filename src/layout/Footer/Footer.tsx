import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSystemLicense, selectCompanyLicense, selectSystemLicense, uploadCompanyLicense } from 'store/features';
import Logo from 'components/UI/Logo';
import Snackbar from 'components/UI/Snackbar';
import License from './components/License';
import Environment from './components/Environment';
import CompanyLicenseDialog from './components/CompanyLicenseDialog';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: system, status: systemLicenseStatus } = useAppSelector(selectSystemLicense);
  const { data: company, updateStatus, error } = useAppSelector(selectCompanyLicense);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleCompanyLicenseClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const handleUpload = (file: File) => {
    dispatch(uploadCompanyLicense(file));
  };

  React.useEffect(() => {
    if (systemLicenseStatus === 'idle') {
      dispatch(fetchSystemLicense());
    }
  }, [systemLicenseStatus, dispatch]);

  React.useEffect(() => {
    if (updateStatus === 'succeeded') {
      handleClose();
    } else if (updateStatus === 'failed') {
      setShowSnackbar(true);
    }
  }, [updateStatus]);

  return (
    <>
      <Box
        component="footer"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, gap: 4, minHeight: 64 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Logo sx={{ width: 36, height: 36 }} />
          <Typography data-testid="app-logo" variant="caption" component="div">
            Fossa
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          <Environment kind={system?.entitlements.environmentKind} name={system?.entitlements.environmentName} />
          <License
            system={system?.terms.licensee.longName}
            company={company?.terms.licensee.longName}
            isCompanyLicenseValid={!!company}
            onCompanyLicenseClick={handleCompanyLicenseClick}
          />
        </Box>
      </Box>
      <CompanyLicenseDialog open={dialogOpen} loading={updateStatus === 'loading'} onClose={handleClose} onFileUpload={handleUpload} />
      {error && <Snackbar type="error" open={showSnackbar} message={error.title} onClose={handleSnackbarClose} />}
    </>
  );
};

export default Footer;
