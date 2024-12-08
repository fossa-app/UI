import * as React from 'react';
import { UserRole } from 'shared/models';
import { COMMON_FIELDS } from 'shared/constants';
import { Column } from 'components/UI/Table';

export const mapTableColumnsByRoles = <T>(
  fields: Column<T>[],
  userRoles?: UserRole[],
  // eslint-disable-next-line no-unused-vars
  renderBodyCell?: (item: T) => React.ReactNode
): Column<T>[] => {
  return fields
    .filter((field) => !field.roles?.length || field.roles.some((role) => userRoles?.includes(role)))
    .map((field) => {
      return {
        ...field,
        ...(field.field === COMMON_FIELDS.actions.field && renderBodyCell && { renderBodyCell }),
      };
    });
};
