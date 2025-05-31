import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid2';
import { useAppSelector } from 'store';
import { selectCompanyLicense, selectIsUserAdmin, selectSystemLicense } from 'store/features';
import Logo from 'components/UI/Logo';
import License from './components/License';
import Environment from './components/Environment';

const Footer: React.FC = () => {
  const isAdmin = useAppSelector(selectIsUserAdmin);
  const { data: system } = useAppSelector(selectSystemLicense);
  const { data: company, fetchStatus } = useAppSelector(selectCompanyLicense);

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
                <Environment kind={system?.entitlements?.environmentKind} name={system?.entitlements?.environmentName} />
                <License
                  loading={fetchStatus === 'idle' || fetchStatus === 'loading'}
                  isAdmin={isAdmin}
                  system={system?.terms?.licensee}
                  company={company?.terms?.licensee}
                />
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Footer;
