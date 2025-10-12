import { UserRole } from 'shared/types';
import { FormFieldProps } from 'components/UI/Form';

export const mapDisabledFields = <T>(fields: FormFieldProps<T>[], userRoles?: UserRole[]): FormFieldProps<T>[] => {
  return fields.map((field) => {
    const hasAccess = field.roles?.some((role) => userRoles?.includes(role));

    return {
      ...field,
      disabled: !hasAccess,
    };
  });
};
