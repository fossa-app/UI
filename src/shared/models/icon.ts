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
  assign = 'assign',
}

export type SvgIcon = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
