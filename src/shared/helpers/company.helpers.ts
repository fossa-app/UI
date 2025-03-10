import { Company, CompanyDTO, Country } from 'shared/models';
import { FieldProps, FieldType, FieldOption } from 'components/UI/Form';

export const mapCompany = (company: CompanyDTO, countries: Country[]): Company => {
  return {
    ...company,
    countryName: countries.find(({ code }) => code === company.countryCode)?.name,
  };
};

export const mapCountriesToFieldOptions = (fields: FieldProps<Company>[], countries?: Country[]): FieldProps<Company>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.type === FieldType.select &&
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
