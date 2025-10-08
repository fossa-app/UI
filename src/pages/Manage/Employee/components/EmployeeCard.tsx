import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Employee, Module, SubModule } from 'shared/models';

interface EmployeeCardProps {
  module: Module;
  subModule: SubModule;
  employee: Employee;
  level?: 'top' | 'subordinate';
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ module, subModule, employee, level }) => {
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  const borderStyles = {
    top: { borderLeft: 4, borderColor: 'secondary.main' },
    subordinate: { borderLeft: 0, borderColor: 'transparent' },
  };
  const currentBorderStyles = level ? borderStyles[level] : borderStyles.subordinate;

  return (
    <Card
      data-cy={`${module}-${subModule}-employee-card-${employee.id}-reportsTo-${employee.reportsToId}`}
      elevation={1}
      sx={{
        display: 'inline-flex',
        width: 280,
        ...currentBorderStyles,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" minHeight={40}>
          <Avatar data-cy={`${module}-${subModule}-employee-content-card-${employee.id}-avatar`} sx={{ bgcolor: 'primary.main' }}>
            {initials}
          </Avatar>
          <Box sx={{ width: 210, display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={employee.fullName} placement="top" arrow>
              <Typography noWrap data-cy={`${module}-${subModule}-employee-content-card-${employee.id}-name`} variant="body1" align="left">
                {employee.fullName}
              </Typography>
            </Tooltip>
            <Tooltip title={employee.jobTitle} placement="top" arrow>
              <Typography
                noWrap
                data-cy={`${module}-${subModule}-employee-content-card-${employee.id}-jobTitle`}
                variant="body2"
                color="textSecondary"
                align="left"
              >
                {employee.jobTitle}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
