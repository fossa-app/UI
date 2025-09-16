import React from 'react';
import Grid from '@mui/material/Grid2';
import AccordionDetails from '@mui/material/AccordionDetails';
import Page from '../Page';
import { ViewDetailFieldProps } from './view-details.model';
import { useViewDetailsContext } from './ViewDetailsContext';
import Detail from './details';

type WithFields<T> = {
  fields: ViewDetailFieldProps<T>[];
  values?: T;
  noValuesTemplate?: React.ReactElement;
  children?: never;
};

type WithChildren = {
  children: React.ReactNode;
  fields?: never;
  values?: never;
  noValuesTemplate?: never;
};

type ViewDetailsContentProps<T> = WithFields<T> | WithChildren;

const ViewDetailsContent = <T,>({ fields, values, noValuesTemplate, children }: ViewDetailsContentProps<T>) => {
  const context = useViewDetailsContext();

  if (!context) {
    throw new Error('ViewDetailsContent must be used within a ViewDetails component using ViewDetailsContext.');
  }

  const { module, subModule, loading } = context;

  return (
    <AccordionDetails sx={{ minHeight: 150, overflowY: 'auto' }}>
      {fields ? (
        <>
          {!loading &&
            !values &&
            (noValuesTemplate ?? (
              <Page module={module} subModule={subModule} sx={{ margin: 0 }}>
                <Page.Subtitle>No Detail Found</Page.Subtitle>
              </Page>
            ))}
          <Grid container spacing={4}>
            {fields.map((field) => {
              if (loading || !values) {
                return null;
              }

              return (
                <Grid key={field.name} {...field.grid}>
                  {field.renderDetailField ? field.renderDetailField(values) : <Detail values={values} {...field} />}
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        children
      )}
    </AccordionDetails>
  );
};

export default ViewDetailsContent;
