import SaveIcon from '@mui/icons-material/Save';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DoneIcon from '@mui/icons-material/Done';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import HubIcon from '@mui/icons-material/Hub';
import { IconType, SvgIcon } from 'shared/models';

export const ICONS: Record<IconType, SvgIcon> = {
  [IconType.save]: SaveIcon,
  [IconType.next]: NavigateNextIcon,
  [IconType.done]: DoneIcon,
  [IconType.company]: StoreIcon,
  [IconType.branch]: BusinessIcon,
  [IconType.employee]: EmojiPeopleIcon,
  [IconType.profile]: PersonIcon,
  [IconType.department]: GroupIcon,
  [IconType.assign]: AssignmentTurnedInIcon,
  [IconType.remove]: RemoveCircleIcon,
  [IconType.settings]: SettingsIcon,
  [IconType.hierarchy]: HubIcon,
};
