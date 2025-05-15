import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Module, SubModule } from 'shared/models';

export type FileUploadProps = {
  module: Module;
  subModule: SubModule;
  accept?: string;
  file?: File;
  onFileSelect: (file: File) => void;
} & BoxProps;

const FileUpload: React.FC<FileUploadProps> = ({ module, subModule, file, accept = '*/*', onFileSelect, ...props }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...props.sx }} {...props}>
      <Input id="file-upload-input" type="file" onChange={handleFileChange} inputProps={{ accept }} style={{ display: 'none' }} />
      <label htmlFor="file-upload-input">
        <Button aria-label="Choose File" variant="contained" component="span">
          Choose File
        </Button>
      </label>
      {file && (
        <Typography
          noWrap
          data-cy={`${module}-${subModule}-file-upload-selected-file-name`}
          variant="body2"
          color="textSecondary"
          sx={{ flexGrow: 1 }}
        >
          {file.name}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
