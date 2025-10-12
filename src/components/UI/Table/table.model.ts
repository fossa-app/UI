import React from 'react';
import { TableCellProps } from '@mui/material/TableCell';
import { Entity, UserRole } from 'shared/types';

export type ActionField = 'view' | 'edit' | 'delete';

export interface ActionFieldConfig {
  field: ActionField;
  name: string;
}

export interface TableActionColumn {
  field: 'actions';
  name: string;
}

export type Column<T = Entity> = {
  name: React.ReactNode;
  field: string;
  width?: number | string;
  roles?: UserRole[];
  renderBodyCell?: (item: T) => React.ReactNode;
} & TableCellProps;

export interface Action<T = Entity> {
  name: React.ReactNode;
  field: ActionField;
  roles?: UserRole[];
  onClick?: (context: T) => void;
}
