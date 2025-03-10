import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CopyToClipboard from 'components/UI/CopyToClipboard';

interface CopyableFieldProps {
  text: string;
}

export const renderCopyableField: React.FC<CopyableFieldProps> = ({ text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="body1">{text}</Typography>
    <CopyToClipboard text={text} />
  </Box>
);
