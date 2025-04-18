import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonIcon from '@mui/icons-material/Person';
import { RouteItem } from 'shared/models';
import { ROUTES } from './routes';

// TODO: create FLOWS tree
export const FLOWS: RouteItem[] = [
  { name: ROUTES.company.name, path: ROUTES.company.path, icon: StoreIcon },
  { name: ROUTES.branches.name, path: ROUTES.branches.path, icon: BusinessIcon },
  { name: ROUTES.employees.name, path: ROUTES.employees.path, icon: EmojiPeopleIcon },
  { name: ROUTES.profile.name, path: ROUTES.profile.path, icon: PersonIcon },
];
