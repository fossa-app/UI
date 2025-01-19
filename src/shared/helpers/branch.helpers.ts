import { Branch, BranchDTO, Company, TimeZone } from 'shared/models';

export const mapBranch = (branch: BranchDTO, timeZones: TimeZone[], companyCountryCode: Company['countryCode']): Branch => {
  const branchTimeZoneCountryCode = timeZones.find((timeZone) => timeZone.id === branch.timeZoneId)?.countryCode;

  return {
    ...branch,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
    isValidCompanyTimeZone: branchTimeZoneCountryCode === companyCountryCode,
  };
};

export const mapBranches = (branches: BranchDTO[], timeZones: TimeZone[], companyCountryCode: Company['countryCode']): Branch[] => {
  return branches.map((branch) => mapBranch(branch, timeZones, companyCountryCode));
};
