import { Branch, BranchDTO, TimeZone } from 'shared/models';

export const mapBranch = (branch: BranchDTO, timeZones: TimeZone[]): Branch => {
  return {
    ...branch,
    timeZoneName: timeZones.find(({ id }) => id === branch.timeZoneId)?.name,
  };
};

export const mapBranches = (branches: BranchDTO[], timeZones: TimeZone[]): Branch[] => {
  return branches.map((branch) => mapBranch(branch, timeZones));
};
