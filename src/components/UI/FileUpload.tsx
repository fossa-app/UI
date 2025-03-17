import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getTestSelectorByModule } from 'shared/helpers';
import { Module, SubModule } from 'shared/models';

type FileUploadProps = {
  accept?: string;
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...sx }} {...props}>
      <Input id="file-upload-input" type="file" onChange={handleFileChange} inputProps={{ accept }} style={{ display: 'none' }} />
      <label htmlFor="file-upload-input">
        <Button aria-label="Choose File" variant="contained" component="span">
          Choose File
        </Button>
      </label>
      {fileName && (
        <Typography
          noWrap
          data-cy={getTestSelectorByModule(Module.shared, SubModule.upload, 'file-upload-selected-file-name')}
          variant="body2"
          color="textSecondary"
          sx={{ flexGrow: 1 }}
        >
          {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
