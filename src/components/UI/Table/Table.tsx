import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import MuiTable from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Page, { PageSubtitle } from 'components/UI/Page';
import { Column, Item } from './table.model';

interface TableProps<T> {
  columns: Column<T>[];
  items?: T[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems?: number;
  noRecordsTemplate?: React.ReactElement;
  // eslint-disable-next-line no-unused-vars
  onPageNumberChange: (pageNumber: number) => void;
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange: (pageSize: number) => void;
}

const Table = <T extends Item>({
  columns,
  items = [],
  loading,
  pageNumber,
  pageSize,
  pageSizeOptions,
  totalItems = 0,
  noRecordsTemplate,
  onPageNumberChange,
  onPageSizeChange,
}: TableProps<T>) => {
  const handlePageNumberChange = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    onPageNumberChange(page + 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  const tableContent = (
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={columns.length} align="left">
            <LinearProgress sx={{ my: 2 }} />
          </TableCell>
        </TableRow>
      ) : items.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            {noRecordsTemplate ?? (
              <Page>
                <PageSubtitle>No Records Found</PageSubtitle>
              </Page>
            )}
          </TableCell>
        </TableRow>
      ) : (
        items.map((row) => (
          <TableRow hover key={row.id}>
            {columns.map((column) => (
              <TableCell key={column.field} align="left" sx={{ width: column.width || 'auto' }}>
                {column.renderBodyCell ? column.renderBodyCell(row) : (row[column.field] ?? 'N/A')}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pt: 4, pr: 4, pb: 1, pl: 4 }}>
      <TableContainer sx={{ flexGrow: 1 }}>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align="left" sx={{ width: column.width, fontWeight: '700', fontSize: 16 }}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {tableContent}
        </MuiTable>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={pageSizeOptions}
        count={totalItems}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={handlePageNumberChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </Paper>
  );
};

export default Table;
