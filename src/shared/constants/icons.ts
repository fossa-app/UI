import * as React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DoneIcon from '@mui/icons-material/Done';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { IconType } from 'shared/models';

export const BUTTON_ICONS: Record<IconType, React.FC<SvgIconProps>> = {
  [IconType.save]: SaveIcon,
  [IconType.next]: NavigateNextIcon,
  [IconType.done]: DoneIcon,
};
