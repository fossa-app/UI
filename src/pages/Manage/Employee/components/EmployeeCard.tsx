import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Employee, Module, SubModule } from 'shared/models';

interface EmployeeCardProps {
  module: Module;
  subModule: SubModule;
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ module, subModule, employee }) => {
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;

  return (
    <Card
      data-cy={`${module}-${subModule}-employee-card-${employee.id}-reportsTo-${employee.reportsToId}`}
      elevation={1}
      sx={{
        display: 'inline-flex',
        width: 240,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center" minHeight={40}>
          <Avatar data-cy={`${module}-${subModule}-employee-content-card-${employee.id}-avatar`} sx={{ bgcolor: 'primary.main' }}>
            {initials}
          </Avatar>
          <Typography data-cy={`${module}-${subModule}-employee-content-card-${employee.id}-name`} variant="body2" align="left">
            {employee.fullName}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
