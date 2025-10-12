import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { Module, SubModule } from 'shared/types';

interface RenderLicenseUsageDetailParams {
  module: Module;
  subModule: SubModule;
  value: number;
  field: string;
  label: string;
}

const ERROR_THRESHOLD = 100;
const WARNING_THRESHOLD = 90;

export const renderLicenseUsageDetail = ({ module, subModule, value, field, label }: RenderLicenseUsageDetailParams) => {
  const displayValue = Math.min(value, 100);

  const getProgressColor = (theme: Theme) => {
    if (displayValue >= ERROR_THRESHOLD) {
      return theme.palette.error.main;
    }

    if (displayValue > WARNING_THRESHOLD) {
      return theme.palette.warning.main;
    }

    return theme.palette.success.main;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography gutterBottom data-cy={`${module}-${subModule}-view-details-label-${field}`} variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          sx={(theme) => ({
            color: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[800],
            }),
          })}
          size={150}
          thickness={5}
          value={100}
        />
        <CircularProgress
          data-cy={`${module}-${subModule}-view-details-value-${field}`}
          variant="determinate"
          sx={{
            color: getProgressColor,
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={150}
          thickness={5}
          value={displayValue}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(displayValue)}% usage`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
