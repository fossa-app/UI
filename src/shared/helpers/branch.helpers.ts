import { BRANCH_FIELDS } from 'shared/constants';
import { Branch, BranchDTO, Company, Country, TimeZone } from 'shared/models';
import { FieldProps, SelectOption } from 'components/UI/Form';
import { mapCountryToFieldSelectOption } from './company.helpers';

export const mapBranch = (
  branch: BranchDTO,
  timeZones: TimeZone[],
  companyCountryCode: Company['countryCode'],
  countries: Country[]
): Branch => {
  const branchTimeZoneCountryCode = timeZones.find((timeZone) => timeZone.id === branch.timeZoneId)?.countryCode;
  const countryName = countries.find((country) => country.code === branch.address?.countryCode)?.name;

  return {
    ...branch,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
    isValidCompanyTimeZone: branchTimeZoneCountryCode === companyCountryCode,
    address: {
      ...branch.address,
      countryName,
    },
    fullAddress: getFullAddress({ ...branch.address, countryName }),
  };
};

export const mapBranches = (
  branches: BranchDTO[],
  timeZones: TimeZone[],
  companyCountryCode: Company['countryCode'],
  countries: Country[]
): Branch[] => {
  return branches.map((branch) => mapBranch(branch, timeZones, companyCountryCode, countries));
};

export const mapOptionsToFieldSelectOptions = (fields: FieldProps[], timeZones?: TimeZone[], countries?: Country[]): FieldProps[] => {
  return fields.map((field) => ({
    ...field,
    ...(field.name === BRANCH_FIELDS.timeZoneId.field &&
      timeZones?.length && {
        options: timeZones.map(mapTimeZoneToFieldSelectOption),
      }),
    ...(field.name === `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.countryCode!.field}` &&
      countries?.length && {
        options: countries.map(mapCountryToFieldSelectOption),
      }),
  }));
};

export const mapTimeZoneToFieldSelectOption = (timeZone: TimeZone): SelectOption => {
  return {
    label: timeZone.name,
    value: timeZone.id,
  };
};

export const getFullAddress = (address?: Branch['address']): Branch['fullAddress'] => {
  if (!address) {
    return '';
  }

  const { line1, line2, city, subdivision, postalCode, countryName } = address;

  return [line1 && `${line1},`, line2 && `${line2},`, city && `${city},`, subdivision, postalCode && `${postalCode},`, countryName]
    .filter(Boolean)
    .join(' ')
    .trim();
};
