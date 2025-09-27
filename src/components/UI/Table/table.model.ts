import React from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { Item, UserRole } from 'shared/models';

export type ActionField = 'view' | 'edit' | 'delete';

export interface ActionFieldConfig {
  field: ActionField;
  name: string;
}

export interface TableActionColumn {
  field: 'actions';
  name: string;
}

export type Column<T = Item> = {
  name: React.ReactNode;
  field: string;
  width?: number | string;
  roles?: UserRole[];
  renderBodyCell?: (item: T) => React.ReactNode;
} & TableCellProps;

export interface Action<T = Item> {
  name: React.ReactNode;
  field: ActionField;
  roles?: UserRole[];
  onClick?: (context: T) => void;
}
