import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Branch, Module, SubModule } from 'shared/models';
import MapView from 'components/UI/Map';

interface RenderBranchMapFieldProps {
  branch: Branch;
}

export const renderBranchMapField = ({ branch }: RenderBranchMapFieldProps) => {
  const noLocationTemplate = (
    <Typography data-cy={`${Module.branchManagement}-${SubModule.branchLocationDetails}-default-location`} variant="body1" color="error">
      Branch location data is unavailable.
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
