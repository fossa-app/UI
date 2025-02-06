import * as React from 'react';
import { FieldValues, RegisterOptions } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SelectProps } from '@mui/material/Select';
import { CheckboxProps } from '@mui/material/Checkbox';
import { GridBaseProps } from '@mui/material/Grid2';
import { TypographyProps } from '@mui/material/Typography';
import { Module, SubModule, UserRole } from 'shared/models';

type Validate<T> = {
  [key: string]: (value: T) => boolean | string | Promise<boolean | string>;
};

export type FormControlRules =
  | Omit<RegisterOptions<FieldValues, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'>
  | { validate?: Validate<FieldValues> }
  | undefined;

export enum FieldType {
  section = 'section',
  text = 'text',
  select = 'select',
  checkbox = 'checkbox',
}

interface BaseFieldProps {
  label: string;
  name: string;
  type: FieldType;
  module: Module;
  subModule: SubModule;
  roles?: UserRole[];
  grid?: GridBaseProps;
  rules?: FormControlRules;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type SectionFieldProps = BaseFieldProps & {
  type: FieldType.section;
} & TypographyProps;

export type InputFieldProps = BaseFieldProps & {
  type: FieldType.text;
} & TextFieldProps;

export type SelectFieldProps = BaseFieldProps & {
  type: FieldType.select;
  options: SelectOption[];
} & SelectProps;

export type CheckboxFieldProps = BaseFieldProps & {
  type: FieldType.checkbox;
  label: string;
} & CheckboxProps;

export type FieldProps<T> = { renderField?: (item?: T) => React.ReactNode } & (
  | SectionFieldProps
  | InputFieldProps
  | SelectFieldProps
  | CheckboxFieldProps
);
