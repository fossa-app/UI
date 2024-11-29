import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Backdrop, { BackdropProps } from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';

const LinearLoader: React.FC<BackdropProps> = (props) => {
  return (
    <Backdrop
      data-cy="linear-loader"
      open={props.open}
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
    >
      <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} color="secondary" />
    </Backdrop>
  );
};

export default LinearLoader;
