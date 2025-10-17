import React from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector, RootState, AppDispatch, StateEntity } from 'store';
import { selectUserRoles } from 'store/features';
import { areEqualBigIds, hasAllowedRole } from 'shared/helpers';
import { Module, SubModule, ErrorResponseDTO, BaseEntity } from 'shared/types';
import PageLayout from 'components/layouts/PageLayout';
import ViewDetails, { ViewDetailActionName, ViewDetailProps } from 'components/UI/ViewDetails';

type EntityViewerProps<T extends BaseEntity> = {
  module: Module;
  subModule: SubModule;
  pageTitle: string;
  fallbackRoute: string;
  viewSchema: ViewDetailProps<T>;
  editRoute?: string;
  selectEntity: (state: RootState) => StateEntity<T | undefined>;
  resetEntity: () => ReturnType<AppDispatch>;
  fetchEntityAction: (id: string) => AsyncThunkAction<T, unknown, { rejectValue: ErrorResponseDTO }>;
};

const EntityViewer = <T extends BaseEntity>({
  module,
  subModule,
  pageTitle,
  fallbackRoute,
  selectEntity,
  resetEntity,
  fetchEntityAction,
  viewSchema,
  editRoute,
}: EntityViewerProps<T>) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { item: values, fetchStatus } = useAppSelector(selectEntity);
  const userRoles = useAppSelector(selectUserRoles);
  const { id } = useParams<{ id: string }>();
  const loading = fetchStatus === 'idle' || fetchStatus === 'loading';
  const hasFetched = React.useRef(false);

  const handleEdit = () => {
    if (editRoute) {
      const path = generatePath(editRoute, { id });
      navigate(path);
    }
  };

  const actions = viewSchema.actions
    ?.filter(({ roles }) => hasAllowedRole(roles, userRoles))
    .map((action) => {
      switch (action.name) {
        case ViewDetailActionName.edit:
          return { ...action, onClick: handleEdit };
        default:
          return action;
      }
    });

  React.useEffect(() => {
    const shouldFetch = !hasFetched.current && id && (!values || !areEqualBigIds(values.id, id));

    if (shouldFetch) {
      dispatch(fetchEntityAction(id));
      hasFetched.current = true;
    }
  }, [id, values, dispatch, fetchEntityAction]);

  React.useEffect(() => {
    if (!id) {
      dispatch(resetEntity());
    }
  }, [id, dispatch, resetEntity]);

  return (
    <PageLayout
      withBackButton
      module={module}
      subModule={subModule}
      pageTitle={pageTitle}
      fallbackRoute={fallbackRoute}
      displayNotFoundPage={fetchStatus === 'failed' && !values}
    >
      <ViewDetails module={module} subModule={subModule} loading={loading}>
        <ViewDetails.Header>{viewSchema.title}</ViewDetails.Header>
        <ViewDetails.Content fields={viewSchema.fields} values={values} />
        <ViewDetails.Actions actions={actions!}></ViewDetails.Actions>
      </ViewDetails>
    </PageLayout>
  );
};

export default EntityViewer;
