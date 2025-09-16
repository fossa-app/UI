import React from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { Item, UserRole } from 'shared/models';

export type Column<T = Item> = {
  name: React.ReactNode;
  field: string;
  width?: number | string;
  roles?: UserRole[];
  renderBodyCell?: (item: T) => React.ReactNode;
} & TableCellProps;

export interface Action<T = Item> {
  name: React.ReactNode;
  field: string;
  roles?: UserRole[];
  onClick?: (context: T) => void;
}
