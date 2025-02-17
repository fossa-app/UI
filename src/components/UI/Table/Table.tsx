import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Paper, { PaperProps } from '@mui/material/Paper';
import { Item, Module, SubModule } from 'shared/models';
import Page, { PageSubtitle } from 'components/UI/Page';
import { Column } from './table.model';
import { StyledTable } from './StyledTable';
import LinearLoader from '../LinearLoader';

type TableProps<T> = {
  module: Module;
  subModule: SubModule;
  columns: Column<T>[];
  items?: T[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems?: number;
  noRecordsTemplate?: React.ReactElement;
  onPageNumberChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
} & PaperProps;

const Table = <T extends Item>({
  module,
  subModule,
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
  ...props
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
          <TableRow hover data-cy={`${module}-${subModule}-table-body-row-${row.id}`} key={row.id}>
            {columns.map((column) => (
              <TableCell
                data-cy={`${module}-${subModule}-table-body-cell-${row.id}-${column.field}`}
                key={column.field}
                align={column.align || 'left'}
                sx={{ width: column.width || 'auto' }}
              >
                {/* TODO: move '-' symbol to a constant */}
                {column.renderBodyCell ? column.renderBodyCell(row) : (row[column.field] ?? '-')}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </TableBody>
  );

  return (
    <Paper
      data-cy={`${module}-${subModule}-table`}
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        pt: 3,
        pr: 3,
        pb: 1,
        pl: 3,
        position: 'relative',
      }}
      {...props}
    >
      {/* TODO: make maxHeight configurable */}
      <TableContainer sx={{ flexGrow: 1, maxHeight: '50vh' }}>
        <StyledTable stickyHeader>
          <TableHead>
            <TableRow data-cy={`${module}-${subModule}-table-head-row`}>
              {columns.map((column) => (
                <TableCell
                  data-cy={`${module}-${subModule}-table-header-cell-${column.field}`}
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{ width: column.width, fontSize: 16 }}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {tableContent}
        </StyledTable>
      </TableContainer>
      <TablePagination
        data-cy={`${module}-${subModule}-table-pagination`}
        component="div"
        rowsPerPageOptions={pageSizeOptions}
        count={totalItems}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={handlePageNumberChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
      <LinearLoader open={loading} />
    </Paper>
  );
};

export default Table;
