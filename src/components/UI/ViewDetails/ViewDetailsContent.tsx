import * as React from 'react';
import Grid from '@mui/material/Grid2';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ViewDetailProps } from './view-details.model';
import { useViewDetailsContext } from './ViewDetailsContext';
import Detail from './details';

type ViewDetailsContentProps<T> = {
  fields: ViewDetailProps<T>[];
  values?: T;
};

const ViewDetailsContent = <T,>({ fields, values }: ViewDetailsContentProps<T>) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsContent must be used within a ViewDetails component using ViewDetailsContext.');
  }

  const { loading } = context;

  return (
    <AccordionDetails sx={{ minHeight: 200, overflow: 'auto' }}>
      <Grid container spacing={4}>
        {fields.map((field) => {
          if (loading || !values) {
            return null;
          }

          return (
            <Grid key={field.name} {...field.grid}>
              <Detail values={values} {...field} />
            </Grid>
          );
        })}
      </Grid>
    </AccordionDetails>
  );
};

export default ViewDetailsContent;
