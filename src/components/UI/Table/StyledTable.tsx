import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';

export const StyledTable = styled(Table)(({ theme }) => {
  return {
    '& .MuiTableCell-root': {
      height: 60,
      padding: theme.spacing(2),
    },
    '& .MuiTableCell-head': {
      height: 40,
    },
  };
});
