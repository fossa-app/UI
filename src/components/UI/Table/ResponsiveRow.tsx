import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Item, Module, SubModule } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import { Column } from './table.model';

type ResponsiveRowProps<T> = {
  module: Module;
  subModule: SubModule;
  item: T;
  columns: Column<T>[];
  isMobile: boolean;
};

const renderCellContent = <T extends Item>(item: T, column: Column<T>): React.ReactNode => {
  return column.renderBodyCell ? column.renderBodyCell(item) : (item[column.field] ?? APP_CONFIG.emptyValue);
};

const ResponsiveRow = <T extends Item>({ module, subModule, item, columns, isMobile }: ResponsiveRowProps<T>) => {
  if (isMobile) {
    return (
      <Card data-cy={`${module}-${subModule}-table-body-row-${item.id}`}>
        <CardContent>
          {columns.map((column) => {
            const content = renderCellContent(item, column);

            return (
              <Box key={column.field} sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                <Typography data-cy={`${module}-${subModule}-table-header-cell-${item.id}-${column.field}`} variant="body2">
                  {column.name}
                </Typography>
                <Box data-cy={`${module}-${subModule}-table-body-cell-${item.id}-${column.field}`} sx={{ flex: 1 }}>
                  {React.isValidElement(content) ? content : <Typography variant="body1">{content}</Typography>}
                </Box>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <TableRow hover data-cy={`${module}-${subModule}-table-body-row-${item.id}`}>
      {columns.map((column) => {
        const content = renderCellContent(item, column);

        return (
          <TableCell
            data-cy={`${module}-${subModule}-table-body-cell-${item.id}-${column.field}`}
            key={column.field}
            align={column.align || 'left'}
            sx={{ width: column.width || 'auto', ...column.sx }}
          >
            {React.isValidElement(content) ? (
              content
            ) : (
              <Typography variant="body1" component="span">
                {content}
              </Typography>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default ResponsiveRow;
