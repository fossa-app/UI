import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, PaginationParams, Status } from 'shared/models';
import clientReducer from './features/identitySlice';
import appConfigReducer from './features/appConfigSlice';
import licenseReducer from './features/licenseSlice';
import authReducer from './features/authSlice';
import setupReducer from './features/setupSlice';
import companyReducer from './features/companySlice';
import branchReducer from './features/branchSlice';
import employeeReducer from './features/employeeSlice';

const store = configureStore({
  reducer: {
    identity: clientReducer,
    appConfig: appConfigReducer,
    license: licenseReducer,
    auth: authReducer,
    setup: setupReducer,
    company: companyReducer,
    branch: branchReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface StateEntity<T = unknown> {
  data: T;
  status?: Status;
  fetchStatus?: Status;
  updateStatus?: Status;
  deleteStatus?: Status;
  error?: ErrorResponse;
  page?: PaginationParams;
}

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
