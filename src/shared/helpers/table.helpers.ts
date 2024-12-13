import * as React from 'react';
import { UserRole } from 'shared/models';
import { ACTION_FIELD } from 'shared/constants';
import { Action, Column } from 'components/UI/Table';

export const mapTableActionsColumn = <T>(columns: Column<T>[], renderBodyCell?: (item: T) => React.ReactNode): Column<T>[] => {
  return columns.map((column) => {
    return {
      ...column,
      ...(column.field === ACTION_FIELD.field && renderBodyCell && { renderBodyCell }),
    };
  });
};

export const filterTableActionsByRoles = <T>(actions: Action<T>[], userRoles?: UserRole[]) => {
  return actions.filter((action) => !action.roles?.length || action.roles.some((role) => userRoles?.includes(role)));
};
