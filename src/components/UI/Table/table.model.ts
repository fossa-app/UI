import * as React from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { Item, UserRole } from 'shared/models';

export interface Column<T = Item> {
  name: React.ReactNode;
  field: string;
  width?: number | string;
  align?: TableCellProps['align'];
  roles?: UserRole[];
  // eslint-disable-next-line no-unused-vars
  renderBodyCell?: (item: T) => React.ReactNode;
}

export interface Action<T = Item> {
  name: React.ReactNode;
  field: string;
  roles?: UserRole[];
  // eslint-disable-next-line no-unused-vars
  onClick?: (context: T) => void;
}
