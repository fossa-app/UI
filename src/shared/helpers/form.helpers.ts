import { UserRole } from 'shared/models';
import { FieldProps } from 'components/UI/Form';

// TODO: fix any type
export const mapDisabledFields = (fields: FieldProps<any>[], userRoles?: UserRole[]): FieldProps<any>[] => {
  return fields.map((field) => {
    const hasAccess = field.roles?.some((role) => userRoles?.includes(role));

    return {
      ...field,
      disabled: !hasAccess,
    };
  });
};
