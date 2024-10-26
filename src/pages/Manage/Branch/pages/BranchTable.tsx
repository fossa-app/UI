import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranches, selectBranches, setBranchesPagination } from 'store/features';
import { Branch } from 'shared/models';
import { APP_CONFIG, BRANCH_FIELDS } from 'shared/constants';
import Page, { PageSubtitle, PageTitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';

const BranchTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fetchStatus, data: branches, page } = useAppSelector(selectBranches);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const columns: Column<Branch>[] = [
    {
      name: BRANCH_FIELDS.name.name,
      field: BRANCH_FIELDS.name.field,
    },
  ];

  const noRecordsTemplate = (
    <Page>
      <PageSubtitle>No Branches Found</PageSubtitle>
    </Page>
  );

  const handlePageNumberChange = (pageNumber: number) => {
    dispatch(setBranchesPagination({ ...page, pageNumber, pageSize }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setBranchesPagination({ ...page, pageSize, pageNumber: 1 }));
  };

  React.useEffect(() => {
    dispatch(fetchBranches([{ pageNumber, pageSize }]));
  }, [pageNumber, pageSize, dispatch]);

  return (
    <Box>
      <Page>
        <PageTitle>Branches</PageTitle>
      </Page>
      <Table<Branch>
        loading={fetchStatus === 'loading'}
        columns={columns}
        items={branches?.items}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        noRecordsTemplate={noRecordsTemplate}
        onPageNumberChange={handlePageNumberChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Box>
  );
};

export default BranchTablePage;
