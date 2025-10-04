import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Module, SubModule } from 'shared/models';
import { ACTION_BUTTON_STYLES } from 'shared/constants';

export type FileUploadProps = {
  module: Module;
  subModule: SubModule;
  disabled?: boolean;
  accept?: string;
  file?: File;
  onFileSelect: (file: File) => void;
} & BoxProps;

const FileUpload: React.FC<FileUploadProps> = ({ module, subModule, file, accept = '*/*', disabled, onFileSelect, ...props }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...props.sx }} {...props}>
      <Input id="file-upload-input" type="file" onChange={handleFileChange} inputProps={{ accept }} style={{ display: 'none' }} />
      <label htmlFor="file-upload-input" style={{ pointerEvents: disabled ? 'none' : 'auto', width: '100%' }}>
        <Button aria-label="Choose File" variant="contained" component="span" disabled={disabled} sx={ACTION_BUTTON_STYLES}>
          Choose File
        </Button>
      </label>
      {file && (
        <Typography
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
