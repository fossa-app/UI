import * as React from 'react';
import { GridBaseProps } from '@mui/material/Grid2';
import { Module, SubModule } from 'shared/models';

export enum ViewDetailType {
  section = 'section',
  labelValue = 'labelValue',
}

export interface ViewDetailProps<T> {
  label: string;
  name: string;
  type: ViewDetailType;
  module: Module;
  subModule: SubModule;
  grid?: GridBaseProps;
  renderDetailField?: (item: T) => React.ReactNode;
}
