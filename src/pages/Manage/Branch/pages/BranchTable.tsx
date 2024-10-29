import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from 'store';
import { deleteBranch, fetchBranches, selectBranches, selectIsUserAdmin, setBranchesPagination } from 'store/features';
import { Branch } from 'shared/models';
import { APP_CONFIG, BRANCH_FIELDS, ROUTES } from 'shared/constants';
import Page, { PageSubtitle } from 'components/UI/Page';
import Table, { Column } from 'components/UI/Table';
import TableLayout from '../../components/TableLayout';

const BranchTablePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { fetchStatus, data: branches, page } = useAppSelector(selectBranches);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const { pageNumber, pageSize, totalItems } = page || APP_CONFIG.table.defaultPagination;
  const pageSizeOptions = APP_CONFIG.table.defaultPageSizeOptions;

  const columns: Column<Branch>[] = [
    {
      name: BRANCH_FIELDS.name.name,
      field: BRANCH_FIELDS.name.field,
    },
    {
      name: '',
      field: 'actions',
      align: 'right',
      renderBodyCell: ({ id }) => {
        return isUserAdmin ? (
          <>
            <IconButton size="small" color="primary" onClick={() => handleEditBranch(id)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDeleteBranch(id)}>
              <DeleteIcon />
            </IconButton>
          </>
        ) : null;
      },
    },
  ];

  const noRecordsTemplate = (
    <Page sx={{ margin: 0 }}>
      <PageSubtitle fontSize={20}>No Branches Found</PageSubtitle>
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

  const handleDeleteBranch = (id: Branch['id']) => {
    const itemsLength = branches?.items.length || 0;

    if (pageNumber > 1 && itemsLength <= 1) {
      dispatch(setBranchesPagination({ ...page, pageSize, pageNumber: pageNumber - 1 }));
    }

    dispatch(deleteBranch(id));
  };

  const handleEditBranch = (id: Branch['id']) => {
    console.log(id);
  };

  React.useEffect(() => {
    dispatch(fetchBranches([{ pageNumber, pageSize }]));
  }, [pageNumber, pageSize, dispatch]);

  return (
    <TableLayout withActionButton={isUserAdmin} pageTitle="Branches" actionButtonLabel="New Branch" onActionClick={handleActionClick}>
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
