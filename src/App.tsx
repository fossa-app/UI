import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';
import './setLeafletDefaultIcon';

const App: React.FC = () => {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
};

export default App;
