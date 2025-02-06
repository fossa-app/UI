import * as React from 'react';
import { GridBaseProps } from '@mui/material/Grid2';
import { Module, SubModule } from 'shared/models';

export enum ViewItemType {
  section = 'section',
  text = 'text',
}

export interface ViewItemProps<T> {
  label: string;
  name: string;
  type: ViewItemType;
  module: Module;
  subModule: SubModule;
  grid?: GridBaseProps;
  renderDetailField?: (item: T) => React.ReactNode;
}
