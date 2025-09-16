import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface CircularLoaderProps {
  delay?: number;
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ delay = 200 }) => {
  const [showLoader, setShowLoader] = React.useState(false);

  React.useEffect(() => {
    const loaderTimeout = setTimeout(() => setShowLoader(true), delay);

    return () => clearTimeout(loaderTimeout);
  }, [delay]);

  if (!showLoader) {
    return null;
  }

  return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
};

export default CircularLoader;
