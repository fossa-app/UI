import { FieldValues, RegisterOptions } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SelectProps } from '@mui/material/Select';
import { GridBaseProps } from '@mui/material/Grid2';
import { Module, SubModule, UserRole } from 'shared/models';

/* eslint-disable no-unused-vars */

type Validate<T> = {
  [key: string]: (value: T) => boolean | string | Promise<boolean | string>;
};

export type FormControlRules =
  | Omit<RegisterOptions<FieldValues, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
  | { validate?: Validate<FieldValues> }
  | undefined;

export enum FieldType {
  text = 'text',
  select = 'select',
}

interface BaseFieldProps {
  label: string;
  name: string;
  type: FieldType;
  module: Module;
  subModule: SubModule;
  roles: UserRole[];
  grid?: GridBaseProps;
  rules?: FormControlRules;
}

export type InputFieldProps = BaseFieldProps & {
  type: FieldType.text;
} & TextFieldProps;

export type SelectFieldProps = BaseFieldProps & {
  type: FieldType.select;
  options: { label: string; value: string }[];
} & SelectProps;

export type FieldProps = InputFieldProps | SelectFieldProps;
