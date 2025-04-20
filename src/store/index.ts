import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { FieldValues } from 'react-hook-form';
import { ErrorResponseDTO, ErrorResponse, PaginationParams, Status } from 'shared/models';
import clientReducer from './features/identitySlice';
import appConfigReducer from './features/appConfigSlice';
import licenseReducer from './features/licenseSlice';
import authReducer from './features/authSlice';
import setupReducer from './features/setupSlice';
import companyReducer from './features/companySlice';
import branchReducer from './features/branchSlice';
import employeeReducer from './features/employeeSlice';
import profileReducer from './features/profileSlice';
import flowReducer from './features/flowSlice';
import messageReducer from './features/messageSlice';
import appLoadingReducer from './features/appLoadingSlice';

const rootReducer = combineReducers({
  identity: clientReducer,
  appConfig: appConfigReducer,
  license: licenseReducer,
  auth: authReducer,
  setup: setupReducer,
  company: companyReducer,
  branch: branchReducer,
  employee: employeeReducer,
  profile: profileReducer,
  flow: flowReducer,
  message: messageReducer,
  appLoading: appLoadingReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export interface StateEntity<T = unknown> {
  data: T;
  status?: Status;
  fetchStatus?: Status;
  updateStatus?: Status;
  deleteStatus?: Status;
  error?: ErrorResponseDTO | ErrorResponse<FieldValues>;
  page?: Partial<PaginationParams>;
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
