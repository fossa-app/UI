import { Branch, BranchDTO, CompanyDTO, TimeZone } from 'shared/models';

export const mapBranch = (branch: BranchDTO, timeZones: TimeZone[]): Branch => {
  return {
    ...branch,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
  };
};

export const mapBranches = (branches: BranchDTO[], timeZones: TimeZone[]): Branch[] => {
  return branches.map((branch) => mapBranch(branch, timeZones));
};

// TODO: remove, for testing purposes
export const mapTestBranchesTimeZone = (branches: BranchDTO[], timeZones: TimeZone[], company?: CompanyDTO): BranchDTO[] => {
  const filteredTimeZones = timeZones.filter((timeZone: any) => timeZone.country?.code === company?.countryCode);

  return branches.map((branch, index) => {
    return {
      ...branch,
      timeZoneId: filteredTimeZones?.length ? filteredTimeZones[index].id : '',
    };
  });
};

// TODO: remove, for testing purposes
export const mapTestBranchTimeZone = (branch: BranchDTO, timeZones: TimeZone[], company?: CompanyDTO): BranchDTO => {
  const filteredTimeZones = timeZones.filter((timeZone: any) => timeZone.country?.code === company?.countryCode);

  return {
    ...branch,
    timeZoneId: filteredTimeZones?.length ? filteredTimeZones[0].id : '',
  };
};
