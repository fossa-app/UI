import { Company, CompanyDTO, Country } from 'shared/models';
import { FormFieldProps, FormFieldType, FieldOption } from 'components/UI/Form';

export const mapCompany = (company: CompanyDTO, countries: Country[]): Company => {
  return {
    ...company,
    countryName: countries.find(({ code }) => code === company.countryCode)?.name,
  };
};

export const mapCountriesToFieldOptions = (fields: FormFieldProps<Company>[], countries?: Country[]): FormFieldProps<Company>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.type === FormFieldType.select &&
      countries?.length && {
        options: countries.map(mapCountryToFieldOption),
      }),
  }));
};

export const mapCountryToFieldOption = (country: Country): FieldOption => {
  return {
    label: country.name,
    value: country.code,
  };
};
