import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import MuiTable from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';
import Page, { PageSubtitle } from 'components/UI/Page';
import { Column, Item } from './table.model';

interface TableProps<T> {
  columns: Column<T>[];
  items: T[] | undefined;
  loading: boolean;
  noRecordsTemplate?: React.ReactElement;
  pageNumber: number;
  pageSize: number;
  pageSizeOptions: number[];
  // eslint-disable-next-line no-unused-vars
  onPageNumberChange: (pageNumber: number) => void;
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange: (pageSize: number) => void;
}

const Table = <T extends Item>({
  columns,
  items,
  pageNumber,
  pageSize,
  pageSizeOptions,
  loading,
  noRecordsTemplate,
  onPageNumberChange,
  onPageSizeChange,
}: TableProps<T>) => {
  const handlePageNumberChange = (event: unknown, page: number) => {
    onPageNumberChange(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  const renderContent = (): React.ReactElement => {
    if (loading) {
      return <LinearProgress />;
    }

    if (!loading && !items?.length) {
      return (
        noRecordsTemplate ?? (
          <Page>
            <PageSubtitle>No Records Found</PageSubtitle>
          </Page>
        )
      );
    }

    return (
      <>
        <TableContainer sx={{ padding: 3 }}>
          <MuiTable stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.field} align="left">
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items!.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = column.renderBodyCell ? column.renderBodyCell(row) : (row[column.field] ?? 'N/A');

                    return (
                      <TableCell key={column.field as string} align="left">
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={pageSizeOptions}
          count={items!.length}
          rowsPerPage={pageSize}
          // BE pageNumber starts from 1
          page={pageNumber - 1}
          onPageChange={handlePageNumberChange}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </>
    );
  };

  return renderContent();
};

export default Table;
