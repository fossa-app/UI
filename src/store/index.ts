import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import clientReducer from './features/identitySlice';
import appConfigReducer from './features/appConfigSlice';
import licenseReducer from './features/licenseSlice';
import authReducer from './features/authSlice';

const store = configureStore({
  reducer: {
    identity: clientReducer,
    appConfig: appConfigReducer,
    license: licenseReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
