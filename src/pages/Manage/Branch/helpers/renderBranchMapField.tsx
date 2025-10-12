import React from 'react';
import Typography from '@mui/material/Typography';
import { Branch, Module, SubModule } from 'shared/types';
import MapView from 'components/UI/Map';

interface RenderBranchMapFieldParams {
  branch?: Branch;
}

export const renderBranchMapField = ({ branch }: RenderBranchMapFieldParams) => {
  const noLocationTemplate = (
    <Typography data-cy={`${Module.branchManagement}-${SubModule.branchLocationDetails}-default-location`} variant="body1" color="error">
      Branch location map is unavailable.
    </Typography>
  );

  return (
    <MapView
      module={Module.branchManagement}
      subModule={SubModule.branchLocationDetails}
      geoAddress={branch?.geoAddress}
      noLocationTemplate={noLocationTemplate}
    />
  );
};
