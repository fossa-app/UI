import * as React from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { createBranch, fetchBranches, selectBranches, selectIsUserAdmin } from 'store/features';
import CompanyDetailsForm from './components/CompanyDetailsForm';

const BranchesPage: React.FC = () => {
  const { status, error } = useAppSelector(selectBranches);
  const isUserAdmin = useAppSelector(selectIsUserAdmin);
  const dispatch = useAppDispatch();
  const notFound = status === 'failed' && error?.status === 404;

  const getBranches = async () => {
    dispatch(fetchBranches({ pageNumber: 1, pageSize: 1 }));
  };

  const handleSubmit = (value: string) => {
    dispatch(createBranch(value));
  };

  React.useEffect(() => {
    if (status === 'idle') {
      getBranches();
    }
  }, [status]);

  return (
    <CompanyDetailsForm
      isAdmin={isUserAdmin}
      notFound={notFound}
      title="Create a Branch"
      label="Enter Branch name"
      validationMessage="Branch name is required"
      notFoundMessage="No Branch found"
      onSubmit={handleSubmit}
    />
  );
};

// TODO: use this loader in the route instead of fetching in the component
// export const loader = async () => {
//   const state = store.getState();
//   const { status } = state.setup.branches;

//   if (status === 'idle') {
//     const data = await store.dispatch(fetchBranches({ pageNumber: 1, pageSize: 1 }));
//     return data;
//   }

//   return null;
// };

export default BranchesPage;
