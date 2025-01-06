import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';

type LinearLoaderProps = {
  delay?: number;
} & BackdropProps;

const LinearLoader: React.FC<LinearLoaderProps> = ({ open, delay = 100, ...props }) => {
  const [showLoader, setShowLoader] = React.useState(false);

  React.useEffect(() => {
    const loaderTimeout = setTimeout(() => setShowLoader(true), delay);

    return () => clearTimeout(loaderTimeout);
  }, [delay]);

  if (!showLoader || !open) {
    return null;
  }

  return (
    <Backdrop
      data-cy="linear-loader"
      open={open}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
        ...props.sx,
      }}
      {...props}
    >
      <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} color="secondary" />
    </Backdrop>
  );
};

export default LinearLoader;
