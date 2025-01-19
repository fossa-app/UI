import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { ViewItemProps } from './view-details.model';
import { useViewDetailsContext } from './ViewDetailsContext';

type ViewDetailsContentProps<T> = {
  fields: ViewItemProps<T>[];
  values?: T;
};

const ViewDetailsContent = <T,>({ fields, values }: ViewDetailsContentProps<T>) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsContent must be used within a ViewDetails component using ViewDetailsContext.');
  }

  const { module, subModule, loading } = context;

  return (
    <Box sx={{ flexGrow: 1, padding: 6 }}>
      <Grid container spacing={5}>
        {fields.map((field) => {
          if (loading || !values) {
            return null;
          }

          const fieldValue = values[field.name as keyof T];

          return (
            <Grid key={field.name} {...field.grid}>
              <Typography data-cy={`${module}-${subModule}-view-details-item-label-${field.name}`} variant="caption" color="textSecondary">
                {field.label}
              </Typography>
              <Box data-cy={`${module}-${subModule}-view-details-item-value-${field.name}`}>
                {field.renderDetailField ? (
                  field.renderDetailField(values)
                ) : (
                  <Typography variant="body1">{fieldValue ? String(fieldValue) : 'N/A'}</Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ViewDetailsContent;
