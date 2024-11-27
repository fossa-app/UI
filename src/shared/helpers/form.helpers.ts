import { UserRole } from 'shared/models';
import { FieldProps } from 'components/UI/Form';

export const mapDisabledFields = (fields: FieldProps[], userRoles?: UserRole[]): FieldProps[] => {
  return fields.map((field) => {
    const hasAccess = field.roles?.some((role) => userRoles?.includes(role));

    return {
      ...field,
      disabled: !hasAccess,
    };
  });
};
