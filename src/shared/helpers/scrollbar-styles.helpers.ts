import muiDarkScrollbar from '@mui/material/darkScrollbar';

export const lightScrollbar = (options?: { track: string; thumb: string; active: string }) => ({
  scrollbarColor: `${options?.thumb || '#b0b0b0'} ${options?.track || '#f0f0f0'}`,
  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
    backgroundColor: options?.track || '#f0f0f0',
  },
  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
    borderRadius: 6,
    backgroundColor: options?.thumb || '#b0b0b0',
    minHeight: 24,
    border: `2px solid ${options?.track || '#f0f0f0'}`,
  },
  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
    backgroundColor: options?.track || '#f0f0f0',
  },
});

export const darkScrollbar = (options?: { track: string; thumb: string; active: string }) => ({
  ...muiDarkScrollbar(options),
  '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
    backgroundColor: options?.track || '#303030',
  },
  '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
    borderRadius: 6,
    backgroundColor: options?.thumb || '#555',
    minHeight: 24,
    border: `2px solid ${options?.track || '#303030'}`,
  },
  '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
    backgroundColor: options?.active || '#888',
  },
  '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
    backgroundColor: options?.track || '#303030',
  },
});
