import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export enum IconType {
  save = 'save',
  next = 'next',
  done = 'done',
  company = 'company',
  branch = 'branch',
  employee = 'employee',
  profile = 'profile',
  department = 'department',
  assign = 'assign',
  remove = 'remove',
  settings = 'settings',
  hierarchy = 'hierarchy',
}

export type SvgIcon = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
