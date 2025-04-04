import * as React from 'react';
import { GridBaseProps } from '@mui/material/Grid2';
import { ButtonProps } from '@mui/material/Button';
import { Module, SubModule, UserRole } from 'shared/models';

export enum ViewDetailType {
  section = 'section',
  labelValue = 'labelValue',
}

export enum ViewDetailActionType {
  button = 'button',
}

export enum ViewDetailActionName {
  edit = 'edit',
  navigate = 'navigate',
}

interface BaseViewDetailActionProps {
  label: string;
  name: string;
  actionType: ViewDetailActionType;
  roles?: UserRole[];
}

export interface ViewDetailFieldProps<T> {
  label: string;
  name: string;
  type: ViewDetailType;
  grid?: GridBaseProps;
  renderDetailField?: (item: T) => React.ReactNode;
}

type ViewDetailActionButtonProps = BaseViewDetailActionProps & {
  actionType: ViewDetailActionType.button;
} & ButtonProps;

export type ViewDetailActionProps = ViewDetailActionButtonProps;

export type ViewDetailProps<T> = {
  module: Module;
  subModule: SubModule;
  title: string;
  fields: ViewDetailFieldProps<T>[];
  actions?: ViewDetailActionProps[];
};
