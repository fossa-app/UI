import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';
import { useDynamicManifest } from 'shared/hooks';
import './setLeafletDefaultIcon';

const App: React.FC = () => {
  useDynamicManifest();

  return <RouterProvider router={router} />;
};

export default App;
