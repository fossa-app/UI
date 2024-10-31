import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import Page, { PageSubtitle } from 'components/UI/Page';
import { Column, Item } from './table.model';
import { StyledTable } from './StyledTable';

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
      {!loading && items.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            {noRecordsTemplate ?? (
              <Page sx={{ margin: 0 }}>
                <PageSubtitle>No Records Found</PageSubtitle>
              </Page>
            )}
          </TableCell>
        </TableRow>
      ) : (
        items.map((row) => (
          <TableRow hover key={row.id}>
            {columns.map((column) => (
              <TableCell key={column.field} align={column.align || 'left'} sx={{ width: column.width || 'auto' }}>
                {column.renderBodyCell ? column.renderBodyCell(row) : (row[column.field] ?? 'N/A')}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );

  return (
    <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pt: 3, pr: 3, pb: 1, pl: 3, position: 'relative' }}>
      <TableContainer sx={{ flexGrow: 1 }}>
        <StyledTable stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align || 'left'} sx={{ width: column.width, fontWeight: '700', fontSize: 16 }}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {tableContent}
        </StyledTable>
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
      <Backdrop
        open={loading}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
        }}
      >
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      </Backdrop>
    </Paper>
  );
};

export default Table;
