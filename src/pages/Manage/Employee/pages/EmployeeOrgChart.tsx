import * as React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from 'store';
import { selectEmployeeOrgChart, fetchOrgChartEmployees } from 'store/features';
import { Module, PaginationParams, SubModule } from 'shared/models';
import { APP_CONFIG } from 'shared/constants';
import LinearLoader from 'components/UI/LinearLoader';
import PageLayout from 'components/layouts/PageLayout';
import EmployeeCard from '../components/EmployeeCard';

const testModule = Module.employeeManagement;
const testSubModule = SubModule.employeeOrgChart;

const EmployeeOrgChartPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    status: fetchStatus,
    items: employees,
    page = APP_CONFIG.table.defaultPagination as PaginationParams,
  } = useAppSelector(selectEmployeeOrgChart);
  const topLevelEmployees = employees.filter(({ reportsToId }) => !reportsToId);
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';

  const renderTree = (managerId?: number) => {
    const subordinateEmployees = employees.filter(({ reportsToId }) => reportsToId === managerId);

    return subordinateEmployees.map((employee) => (
      <TreeNode key={employee.id} label={<EmployeeCard module={testModule} subModule={testSubModule} employee={employee} />}>
        {renderTree(employee.id)}
      </TreeNode>
    ));
  };

  React.useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchOrgChartEmployees(page));
    }
  }, [fetchStatus, page, dispatch]);

  return (
    <PageLayout
      module={testModule}
      subModule={testSubModule}
      pageTitle="Organization Chart"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        position: 'relative',
        height: APP_CONFIG.scrollableContentHeight,
        width: APP_CONFIG.table.containerWidth,
        maxWidth: '100%',
        overflowX: 'auto',
      }}
    >
      {!loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 4,
          }}
        >
          {topLevelEmployees.map((root) => (
            <Box data-cy={`${testModule}-${testSubModule}-org-chart-root-tree-${root.id}`} key={root.id} sx={{ p: 2 }}>
              <Tree
                lineWidth="2px"
                lineHeight="16px"
                lineColor={theme.palette.divider}
                label={<EmployeeCard module={testModule} subModule={testSubModule} employee={root} />}
              >
                {renderTree(root.id)}
              </Tree>
            </Box>
          ))}
        </Box>
      )}
      <LinearLoader open={loading} backgroundColor="inherit" />
    </PageLayout>
  );
};

export default EmployeeOrgChartPage;
