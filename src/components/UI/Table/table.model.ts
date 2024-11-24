import * as React from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { Item } from 'shared/models';

export interface Column<T = Item> {
  name: React.ReactNode;
  field: string;
  width?: number | string;
  align?: TableCellProps['align'];
  // eslint-disable-next-line no-unused-vars
  renderBodyCell?: (item: T) => React.ReactNode;
}
