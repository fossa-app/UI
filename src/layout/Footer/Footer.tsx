import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSystem, selectSystem } from 'store/features';
import Logo from '../../components/UI/Logo';
import License from './components/License';
import Environment from './components/Environment';

const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: system, status } = useAppSelector(selectSystem);

  const getSystem = async () => {
    dispatch(fetchSystem());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getSystem();
    }
  }, [status]);

  return (
    <Box
      component="footer"
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, gap: 4, minHeight: 64 }}
    >
      <>
        <Logo sx={{ width: 36, height: 36 }} />
        <Typography data-testid="app-logo" variant="caption" component="div" sx={{ flexGrow: 1 }}>
          Fossa
        </Typography>
      </>
      {system && (
        <>
          <Environment kind={system.entitlements.environmentKind} name={system.entitlements.environmentName} />
          <License system={system.terms.licensor.longName} company={system.terms.licensee.longName} />
        </>
      )}
    </Box>
  );
};

export default Footer;
