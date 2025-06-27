import * as React from 'react';
import { FieldValues, RegisterOptions } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { ButtonProps } from '@mui/material/Button';
import { AutocompleteInputChangeReason, AutocompleteProps } from '@mui/material/Autocomplete';
import { SelectProps } from '@mui/material/Select';
import { CheckboxProps } from '@mui/material/Checkbox';
import { SwitchProps } from '@mui/material/Switch';
import { GridBaseProps } from '@mui/material/Grid2';
import { TypographyProps } from '@mui/material/Typography';
import { Module, SubModule, ThemeMode, UserRole } from 'shared/models';
import { LoadingButtonProps } from '../LoadingButton';
import { FileUploadProps } from '../FileUpload';

type Validate<T> = {
  [key: string]: (value: T) => boolean | string | Promise<boolean | string>;
};

export type FormControlRules =
  | Omit<RegisterOptions<FieldValues, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
  | { validate?: Validate<FieldValues> }
  | undefined;

export enum FormFieldType {
  section = 'section',
  text = 'text',
  select = 'select',
  autocomplete = 'autocomplete',
  checkbox = 'checkbox',
  switch = 'switch',
  labelValue = 'labelValue',
  fileUpload = 'fileUpload',
  colorScheme = 'colorScheme',
}

export enum FormActionType {
  button = 'button',
  loadingButton = 'loadingButton',
}

export enum FormActionName {
  cancel = 'cancel',
  submit = 'submit',
  delete = 'delete',
}

interface BaseFormFieldProps {
  label: string;
  name: string;
  type: FormFieldType;
  roles?: UserRole[];
  grid?: GridBaseProps;
  rules?: FormControlRules;
}

interface FormBaseActionProps {
  label: string;
  name: string;
  actionType: FormActionType;
  roles?: UserRole[];
}

export interface FieldOption {
  label: string;
  value: string;
}

export type SectionFieldProps = BaseFormFieldProps & {
  type: FormFieldType.section;
} & TypographyProps;

export type LabelValueFieldProps = BaseFormFieldProps & {
  type: FormFieldType.labelValue;
} & TypographyProps;

export type InputFieldProps = BaseFormFieldProps & {
  type: FormFieldType.text;
} & TextFieldProps;

export type AutocompleteFieldProps = BaseFormFieldProps & {
  type: FormFieldType.autocomplete;
  // TODO: add renderOptions to map to the field options
  options: FieldOption[];
  loading?: boolean;
  onInputChange?: (event: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => void;
  onScrollEnd?: () => void;
} & Omit<AutocompleteProps<FieldOption, boolean | undefined, boolean | undefined, boolean | undefined>, 'renderInput'>;

export type SelectFieldProps = BaseFormFieldProps & {
  type: FormFieldType.select;
  // TODO: add renderOptions to map to the field options
  options: FieldOption[];
} & SelectProps;

export type CheckboxFieldProps = BaseFormFieldProps & {
  type: FormFieldType.checkbox;
  label: string;
} & CheckboxProps;

export type SwitchFieldProps = BaseFormFieldProps & {
  type: FormFieldType.switch;
  label: string;
} & SwitchProps;

export type FileUploadFieldProps = BaseFormFieldProps & {
  type: FormFieldType.fileUpload;
  accept?: string;
  onFileSelect?: (file: File) => void;
} & Partial<FileUploadProps>;

export type ColorSchemeFieldProps = BaseFormFieldProps & {
  type: FormFieldType.colorScheme;
  mode?: ThemeMode;
  disabled?: boolean;
};

export type FormFieldProps<T> = { renderField?: (item?: T) => React.ReactNode } & (
  | SectionFieldProps
  | LabelValueFieldProps
  | InputFieldProps
  | AutocompleteFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
  | SwitchFieldProps
  | FileUploadFieldProps
  | ColorSchemeFieldProps
);

type FormActionButtonProps = FormBaseActionProps & {
  actionType: FormActionType.button;
} & ButtonProps;

type FormActionLoadingButtonProps = FormBaseActionProps & {
  actionType: FormActionType.loadingButton;
} & LoadingButtonProps;

export type FormActionProps = FormActionButtonProps | FormActionLoadingButtonProps;

export type FormProps<T> = {
  module: Module;
  subModule: SubModule;
  title: string;
  fields: FormFieldProps<T>[];
  actions: FormActionProps[];
};
