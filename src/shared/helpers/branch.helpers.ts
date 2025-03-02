import { BRANCH_FIELDS } from 'shared/constants';
import { Branch, BranchDTO, Company, Country, TimeZone } from 'shared/models';
import { FieldProps, FieldOption } from 'components/UI/Form';
import { mapCountryToFieldSelectOption } from './company.helpers';

export const mapBranch = (
  branch: BranchDTO,
  timeZones: TimeZone[],
  companyCountryCode: Company['countryCode'],
  countries: Country[]
): Branch => {
  const branchTimeZoneCountryCode = timeZones.find((timeZone) => timeZone.id === branch.timeZoneId)?.countryCode;
  const { address } = branch;
  const countryName = countries.find((country) => country.code === address?.countryCode)?.name;
  const isValid = address ? address.countryCode === companyCountryCode : branchTimeZoneCountryCode === companyCountryCode;

  return {
    ...branch,
    isValid,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
    address: address
      ? {
          ...address,
          countryName,
        }
      : null,
    noPhysicalAddress: !address,
    fullAddress: address ? getFullAddress({ ...address, countryName }) : '',
  };
};

export const mapBranchDTO = (branch: Branch): BranchDTO => {
  if (branch.noPhysicalAddress) {
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
    address,
    name: branch.name,
    timeZoneId: branch.timeZoneId,
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

export const mapBranchFieldOptionsToFieldSelectOptions = (
  fields: FieldProps<Branch>[],
  timeZones?: TimeZone[],
  countries?: Country[]
): FieldProps<Branch>[] => {
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

export const mapTimeZoneToFieldSelectOption = (timeZone: TimeZone): FieldOption => {
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

export const getBranchManagementDetailsByAddressFormSchema = (
  schema: FieldProps<Branch>[],
  noPhysicalAddress: boolean
): FieldProps<Branch>[] => {
  if (noPhysicalAddress) {
    const addressFields = [
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line1!.field}`,
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.line2!.field}`,
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.city!.field}`,
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.subdivision!.field}`,
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.countryCode!.field}`,
      `${BRANCH_FIELDS.address.field}.${BRANCH_FIELDS.address.postalCode!.field}`,
    ];
    return schema.filter((field) => !addressFields.includes(field.name));
  }

  return schema;
};
