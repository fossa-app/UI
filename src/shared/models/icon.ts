import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

export enum IconType {
  save = 'save',
  next = 'next',
  done = 'done',
}

export type SvgIcon = OverridableComponent<SvgIconTypeMap<unknown, 'svg'>>;
