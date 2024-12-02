import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid2';
import { useAppDispatch, useAppSelector } from 'store';
import {
  fetchSystemLicense,
  selectCompanyLicense,
  selectIsUserAdmin,
  selectStep,
  selectSystemLicense,
  uploadCompanyLicense,
} from 'store/features';
import Logo from 'components/UI/Logo';
import License from './components/License';
import Environment from './components/Environment';
import CompanyLicenseDialog from './components/CompanyLicenseDialog';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsUserAdmin);
  const { data: system, status: systemLicenseStatus } = useAppSelector(selectSystemLicense);
  const { data: company, updateStatus } = useAppSelector(selectCompanyLicense);
  const { status: stepStatus } = useAppSelector(selectStep);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const setupCompleted = stepStatus === 'succeeded';

  const handleCompanyLicenseClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleUpload = (file: File) => {
    dispatch(uploadCompanyLicense(file));
    // TODO: display a success message on upload
  };

  React.useEffect(() => {
    if (systemLicenseStatus === 'idle') {
      dispatch(fetchSystemLicense());
    }
  }, [systemLicenseStatus, dispatch]);

  React.useEffect(() => {
    if (updateStatus === 'succeeded') {
      handleClose();
    }
  }, [updateStatus]);

  return (
    <>
      <AppBar position="static" component="footer" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
            <Grid>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Logo sx={{ width: 36, height: 36 }} />
                <Typography data-testid="app-logo" variant="caption" component="div">
                  Fossa
                </Typography>
              </Box>
            </Grid>
            <Grid>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Environment kind={system?.entitlements.environmentKind} name={system?.entitlements.environmentName} />
                <License
                  isAdmin={isAdmin}
                  system={system?.terms.licensee.longName}
                  company={company?.terms?.licensee.longName}
                  setupCompleted={setupCompleted}
                  onCompanyLicenseClick={handleCompanyLicenseClick}
                />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <CompanyLicenseDialog
        data-cy="company-license-dialog"
        open={dialogOpen}
        loading={updateStatus === 'loading'}
        onClose={handleClose}
        onFileUpload={handleUpload}
      />
    </>
  );
};

export default Footer;
