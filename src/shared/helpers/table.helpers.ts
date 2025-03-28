import * as React from 'react';
import { ACTION_FIELD } from 'shared/constants';
import { Column } from 'components/UI/Table';

export const mapTableActionsColumn = <T>(columns: Column<T>[], renderBodyCell?: (item: T) => React.ReactNode): Column<T>[] => {
  return columns.map((column) => {
    return {
      ...column,
      ...(column.field === ACTION_FIELD.field && renderBodyCell && { renderBodyCell }),
    };
  });
};
