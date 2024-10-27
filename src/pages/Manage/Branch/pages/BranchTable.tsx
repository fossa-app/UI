import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { fetchBranches, selectBranches, setBranchesPagination } from 'store/features';
import { Branch } from 'shared/models';
import { APP_CONFIG, BRANCH_FIELDS, ROUTES } from 'shared/constants';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';
import TableLayout from 'pages/Manage/components/TableLayout';

const BranchTablePage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleActionClick = () => {
    navigate(ROUTES.newBranch.path);
  };

  React.useEffect(() => {
    dispatch(fetchBranches([{ pageNumber, pageSize }]));
  }, [pageNumber, pageSize, dispatch]);

  return (
    <TableLayout withActionButton pageTitle="Branches" actionButtonLabel="New Branch" onActionClick={handleActionClick}>
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
    </TableLayout>
  );
};

export default BranchTablePage;
