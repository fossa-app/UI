import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';

export const StyledTable = styled(Table)(({ theme }) => {
  return {
    '& .MuiTableRow-root': {
      height: 60,
    },
    '& .MuiTableCell-head': {
      padding: theme.spacing(2),
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(3),
    },
  };
});
