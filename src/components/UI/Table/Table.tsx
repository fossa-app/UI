import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import MuiTable from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import LinearProgress from '@mui/material/LinearProgress';
import Page, { PageSubtitle } from 'components/Page';
import { Column, Item } from './table.model';

interface TableProps<T> {
  columns: Column<T>[];
  items: T[] | undefined;
  loading: boolean;
  noRecords?: React.ReactElement;
}

const Table = <T extends Item>({ columns, items, loading, noRecords }: TableProps<T>) => {
  const renderContent = (): React.ReactElement => {
    if (loading) {
      return <LinearProgress />;
    }

    if (!loading && !items?.length) {
      return (
        noRecords ?? (
          <Page>
            <PageSubtitle>No Records Found</PageSubtitle>
          </Page>
        )
      );
    }

    return (
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
    );
  };

  return renderContent();
};

export default Table;
