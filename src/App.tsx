import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from 'routes/router';
import './setLeafletDefaultIcon';

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
