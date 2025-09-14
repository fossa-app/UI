import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import Paper, { PaperProps } from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useResponsive } from 'shared/hooks';
import { Item, Module, SubModule } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import Page from 'components/UI/Page';
import { Column } from './table.model';
import { StyledTable } from './StyledTable';
import LinearLoader from '../LinearLoader';
import ResponsiveRow from './ResponsiveRow';

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
  const { isMobile } = useResponsive();
  const noData = !loading && items.length === 0;

  const handlePageNumberChange = (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    onPageNumberChange(page + 1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  const renderEmptyState = () => (
    <>
      {noRecordsTemplate ?? (
        <Page module={module} subModule={subModule} sx={{ margin: 0 }}>
          <Page.Subtitle>No Records Found</Page.Subtitle>
        </Page>
      )}
    </>
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
        height: APP_CONFIG.scrollableContentHeight,
        width: APP_CONFIG.table.containerWidth,
        maxWidth: '100%',
      }}
      {...props}
    >
      {isMobile ? (
        <Box sx={{ flexGrow: 1, maxHeight: APP_CONFIG.table.containerMaxHeight, overflow: 'auto' }}>
          {noData ? (
            renderEmptyState()
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, p: 2 }}>
              {items.map((item) => (
                <ResponsiveRow key={item.id} module={module} subModule={subModule} item={item} columns={columns} isMobile={isMobile} />
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <TableContainer sx={{ flexGrow: 1, maxHeight: APP_CONFIG.table.containerMaxHeight }}>
          <StyledTable stickyHeader sx={{ minWidth: `calc(${APP_CONFIG.containerWidth}px - 34px)` }} aria-label="table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    data-cy={`${module}-${subModule}-table-header-cell-${column.field}`}
                    key={column.field}
                    align={column.align || 'left'}
                    sx={{ width: column.width || 'auto', ...column.sx }}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {noData ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {renderEmptyState()}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <ResponsiveRow key={item.id} module={module} subModule={subModule} item={item} columns={columns} isMobile={isMobile} />
                ))
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
      )}

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
