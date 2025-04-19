import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import PersonIcon from '@mui/icons-material/Person';
import { Flow } from 'shared/models';
import { ROUTES } from './routes';

export const ALL_FLOWS: Flow[] = [
  {
    name: ROUTES.company.name,
    path: ROUTES.company.path,
    icon: StoreIcon,
    subFlows: [
      {
        name: ROUTES.setCompany.name,
        path: ROUTES.setCompany.path,
        icon: StoreIcon,
      },
      {
        name: ROUTES.viewCompany.name,
        path: ROUTES.viewCompany.path,
        icon: StoreIcon,
      },
    ],
  },
  {
    name: ROUTES.branches.name,
    path: ROUTES.branches.path,
    icon: BusinessIcon,
    subFlows: [
      {
        name: ROUTES.setBranch.name,
        path: ROUTES.setBranch.path,
        icon: BusinessIcon,
      },
      {
        name: ROUTES.branches.name,
        path: ROUTES.branches.path,
        icon: BusinessIcon,
      },
    ],
  },
  {
    name: ROUTES.employees.name,
    path: ROUTES.employees.path,
    icon: EmojiPeopleIcon,
    subFlows: [
      {
        name: ROUTES.employees.name,
        path: ROUTES.employees.path,
        icon: EmojiPeopleIcon,
      },
    ],
  },
  {
    name: ROUTES.profile.name,
    path: ROUTES.profile.path,
    icon: PersonIcon,
    subFlows: [
      {
        name: ROUTES.setEmployee.name,
        path: ROUTES.setEmployee.path,
        icon: PersonIcon,
      },
      {
        name: ROUTES.viewProfile.name,
        path: ROUTES.viewProfile.path,
        icon: PersonIcon,
      },
    ],
  },
];
