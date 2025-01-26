import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { getNestedValue } from 'shared/helpers';
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
    <AccordionDetails sx={{ minHeight: 200, overflow: 'auto' }}>
      <Grid container spacing={5}>
        {fields.map((field) => {
          if (loading || !values) {
            return null;
          }

          const fieldValue = getNestedValue(values, field.name);

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
    </AccordionDetails>
  );
};

export default ViewDetailsContent;
