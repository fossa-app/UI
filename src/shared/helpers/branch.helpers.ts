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
  const isValid = branch.address ? branch.address.countryCode === companyCountryCode : branchTimeZoneCountryCode === companyCountryCode;

  return {
    ...branch,
    isValid,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
    address: {
      ...branch.address,
      countryName,
    },
    nonPhysicalAddress: !branch.address,
    fullAddress: getFullAddress({ ...branch.address, countryName }),
  };
};

export const mapBranchDTO = (branch: Branch): BranchDTO => {
  if (branch.nonPhysicalAddress) {
    return {
      name: branch.name,
      timeZoneId: branch.timeZoneId,
      address: null,
    };
  }

  const address =
    branch.address &&
    branch.address.line1 &&
    branch.address.city &&
    branch.address.countryCode &&
    branch.address.subdivision &&
    branch.address.postalCode
      ? {
          line1: branch.address.line1,
          line2: branch.address.line2,
          city: branch.address.city,
          subdivision: branch.address.subdivision,
          postalCode: branch.address.postalCode,
          countryCode: branch.address.countryCode,
        }
      : null;

  return {
    name: branch.name,
    timeZoneId: branch.timeZoneId,
    address: address,
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

export const getBranchManagementDetailsFormSchema = (schema: FieldProps[], nonPhysicalAddress: boolean): FieldProps[] => {
  if (nonPhysicalAddress) {
    return schema.filter((field) => !field.name.includes(BRANCH_FIELDS.address.field));
  }

  return schema;
};
