import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchSystem, selectSystem } from 'store/features';
import License from './components/License';
import Environment from './components/Environment';

const Footer: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const { data: system, status } = useAppSelector(selectSystem);

  const getSystem = async (): Promise<void> => {
    dispatch(fetchSystem());
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getSystem();
    }
  }, [status]);

  return (
    <Box component="footer" display="flex" justifyContent="flex-end" alignItems="center" padding={2} gap={4} minHeight={64}>
      {system && (
        <>
          <Environment kind={system.entitlements.environmentKind} />
          <License name={system.terms.licensee.longName} />
        </>
      )}
    </Box>
  );
};

export default Footer;
