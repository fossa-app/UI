import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PaginationParams, GeneralErrorResponse } from 'shared/models';
import clientReducer from './features/identitySlice';
import appConfigReducer from './features/appConfigSlice';
import licenseReducer from './features/licenseSlice';
import authReducer from './features/authSlice';
import onboardingReducer from './features/onboardingSlice';
import offboardingReducer from './features/offboardingSlice';
import companyReducer from './features/companySlice';
import companySettingsReducer from './features/companySettingsSlice';
import branchReducer from './features/branchSlice';
import departmentReducer from './features/departmentSlice';
import employeeReducer from './features/employeeSlice';
import profileReducer from './features/profileSlice';
import flowReducer from './features/flowSlice';
import messageReducer from './features/messageSlice';

const rootReducer = combineReducers({
  identity: clientReducer,
  appConfig: appConfigReducer,
  license: licenseReducer,
  auth: authReducer,
  onboarding: onboardingReducer,
  offboarding: offboardingReducer,
  company: companyReducer,
  companySettings: companySettingsReducer,
  branch: branchReducer,
  department: departmentReducer,
  employee: employeeReducer,
  profile: profileReducer,
  flow: flowReducer,
  message: messageReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface StateEntity<T = unknown> {
  item: T;
  fetchStatus: Status;
  updateStatus?: Status;
  deleteStatus?: Status;
  fetchError?: GeneralErrorResponse;
  updateError?: GeneralErrorResponse;
  deleteError?: GeneralErrorResponse;
}

export interface PaginatedStateEntity<T = unknown> {
  items: T[];
  page: PaginationParams;
  status: Status;
  error?: GeneralErrorResponse;
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
