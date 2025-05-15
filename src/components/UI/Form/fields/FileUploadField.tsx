import * as React from 'react';
import { Controller, useFormContext as reactHookFormContext } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FileUpload from 'components/UI/FileUpload';
import { FileUploadFieldProps } from '../form.model';
import { useFormContext } from '../FormContext';

const FileUploadField: React.FC<FileUploadFieldProps> = ({ name, label, ...props }) => {
  const { control } = reactHookFormContext();
  const { module, subModule } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={props.rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          {label && <FormLabel>{label}</FormLabel>}
          <FileUpload
            data-cy={`${module}-${subModule}-form-field-${name}-file-upload`}
            module={module}
            subModule={subModule}
            file={value}
            onFileSelect={(file: File) => {
              onChange(file);
              onBlur();
              props.onFileSelect?.(file);
            }}
            {...props}
          />
          {error && (
            <FormHelperText error data-cy={`${module}-${subModule}-form-field-${name}-file-upload-validation`}>
              {error.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
};

export default FileUploadField;
