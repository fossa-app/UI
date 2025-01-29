import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { RouteItem } from 'shared/models';
import { ROUTES } from './routes';

export const MENU_ITEMS: RouteItem[] = [
  { name: ROUTES.company.name, path: ROUTES.company.path, icon: StoreIcon },
  { name: ROUTES.branches.name, path: ROUTES.branches.path, icon: BusinessIcon },
  { name: ROUTES.employees.name, path: ROUTES.employees.path, icon: EmojiPeopleIcon },
];
