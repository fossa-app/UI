import { SxProps, Theme } from '@mui/material/styles';

export const ACTION_FIELDS = {
  view: {
    field: 'view',
    name: 'View',
  },
  edit: {
    field: 'edit',
    name: 'Edit',
  },
  delete: {
    field: 'delete',
    name: 'Delete',
  },
};

export const ACTION_FIELD = {
  name: 'Actions',
  field: 'actions',
};

export const SEARCH_PORTAL_ID = 'search-field';

export const ACTION_BUTTON_STYLES: SxProps<Theme> = { width: { xs: '100%', sm: 'auto' } };
