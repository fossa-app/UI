import { Country, UserRole } from 'shared/models';
import { FieldProps, FieldType, SelectOption } from 'components/UI/Form';

export const mapDisabledFields = (fields: FieldProps[], userRoles?: UserRole[]): FieldProps[] => {
  return fields.map((field) => {
    const hasAccess = field.roles?.some((role) => userRoles?.includes(role));

    return {
      ...field,
      disabled: !hasAccess,
    };
  });
};

export const mapCountriesToFieldSelectOptions = (fields: FieldProps[], countries?: Country[]): FieldProps[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.type === FieldType.select &&
      countries?.length && {
        options: countries.map(mapCountryToFieldSelectOption),
      }),
  }));
};

export const mapCountryToFieldSelectOption = (country: Country): SelectOption => {
  return {
    label: country.name,
    value: country.code,
  };
};
