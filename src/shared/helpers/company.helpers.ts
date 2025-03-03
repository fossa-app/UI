import { Company, CompanyDTO, Country } from 'shared/models';
import { FieldProps, FieldType, FieldOption } from 'components/UI/Form';

export const mapCompany = (company: CompanyDTO, countries: Country[]): Company => {
  return {
    ...company,
    countryName: countries.find(({ code }) => code === company.countryCode)?.name,
  };
};

export const mapCountriesToFieldSelectOptions = (fields: FieldProps<Company>[], countries?: Country[]): FieldProps<Company>[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.type === FieldType.select &&
      countries?.length && {
        options: countries.map(mapCountryToFieldSelectOption),
      }),
  }));
};

export const mapCountryToFieldSelectOption = (country: Country): FieldOption => {
  return {
    label: country.name,
    value: country.code,
  };
};
