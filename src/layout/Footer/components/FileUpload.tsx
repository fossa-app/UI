import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type FileUploadProps = {
  accept?: string;
  // eslint-disable-next-line no-unused-vars
  onFileSelect: (file: File) => void;
} & BoxProps;

const FileUpload: React.FC<FileUploadProps> = ({ accept = '*/*', onFileSelect, sx, ...props }) => {
  const [fileName, setFileName] = React.useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <Box data-cy="upload-file" sx={{ display: 'flex', alignItems: 'center', gap: 2, ...sx }} {...props}>
      <Input id="file-upload-input" type="file" onChange={handleFileChange} inputProps={{ accept }} style={{ display: 'none' }} />
      <label htmlFor="file-upload-input">
        <Button variant="contained" component="span">
          Choose File
        </Button>
      </label>
      {fileName && (
        <Typography noWrap data-cy="selected-file-name" variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
          {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;