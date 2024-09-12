import * as React from 'react';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import axios from 'core/axios';
import { Client } from 'shared/models';
import { URLS } from 'shared/constants';
import { getBackendOrigin } from 'shared/helpers';

const App: React.FC = () => {
  const [client, setClient] = React.useState<Client | null>(null);

  const getClient = async (): Promise<void> => {
    const origin = window.location.origin;
    const beOrigin = getBackendOrigin(origin);

    try {
      const { data } = await axios.get<Client>(`
        ${beOrigin}/${URLS.base}/${URLS.client}?origin=${origin}
      `);
      setClient(data);
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  React.useEffect(() => {
    getClient();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Typography variant="h3">Fossa</Typography>
      {client && (
        <Typography variant="subtitle1">Client: {client.clientName}</Typography>
      )}
    </Box>
  );
};

export default App;
