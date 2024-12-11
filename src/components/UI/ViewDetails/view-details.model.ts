import { GridBaseProps } from '@mui/material/Grid2';
import { Module, SubModule } from 'shared/models';

export interface ViewItemProps<T> {
  label: string;
  name: string;
  module: Module;
  subModule: SubModule;
  value?: T;
  grid?: GridBaseProps;
}
