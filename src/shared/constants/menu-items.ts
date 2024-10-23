import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import HouseIcon from '@mui/icons-material/House';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { RouteItem } from 'shared/models';
import { ROUTES } from './routes';

export const MENU_ITEMS: RouteItem[] = [
  { name: ROUTES.dashboard.name, path: ROUTES.dashboard.path, icon: DashboardIcon },
  { name: ROUTES.company.name, path: ROUTES.company.path, icon: BusinessIcon },
  { name: ROUTES.branches.name, path: ROUTES.branches.path, icon: HouseIcon },
  { name: ROUTES.employees.name, path: ROUTES.employees.path, icon: EmojiPeopleIcon },
];
