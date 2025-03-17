import * as React from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Module, SubModule } from 'shared/models';
import { getTestSelectorByModule } from 'shared/helpers';
import LoadingButton from 'components/UI/LoadingButton';
import FileUpload from 'components/UI/FileUpload';

const testModule = Module.shared;
const testSubModule = SubModule.license;

type CompanyLicenseDialogProps = {
  loading: boolean;
  onFileUpload: (file: File) => void;
} & DialogProps;

const CompanyLicenseDialog: React.FC<CompanyLicenseDialogProps> = ({ loading, onFileUpload, ...props }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setErrorMessage('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setErrorMessage('File is not selected');

      return;
    }

    onFileUpload(selectedFile);
  };

  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    setErrorMessage('');

    if (props.onClose) {
      setSelectedFile(null);
      props.onClose(event, reason);
    }
  };

  return (
    <Dialog
      {...props}
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleUpload();
          },
        },
      }}
    >
      <DialogTitle data-cy={getTestSelectorByModule(testModule, testSubModule, 'dialog-title')}>Upload License File</DialogTitle>
      <DialogContent>
        <DialogContentText>Please select a license file to upload.</DialogContentText>
        <FileUpload onFileSelect={handleFileSelect} sx={{ my: 2 }} />
        {errorMessage && (
          <Typography
            data-cy={getTestSelectorByModule(testModule, testSubModule, 'dialog-validation-message')}
            variant="body2"
            color="error"
          >
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'dialog-cancel-button')}
          aria-label="Cancel"
          variant="text"
          color="secondary"
          onClick={() => handleClose({}, 'backdropClick')}
        >
          Cancel
        </Button>
        <LoadingButton
          data-cy={getTestSelectorByModule(testModule, testSubModule, 'dialog-upload-button')}
          type="submit"
          loadingPosition="end"
          loading={loading}
          endIcon={<UploadFileIcon />}
        >
          Upload
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyLicenseDialog;
