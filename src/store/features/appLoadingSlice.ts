import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';

interface AppLoadingState {
  loading: boolean;
}

const initialState: AppLoadingState = {
  loading: false,
};

const appLoadingSlice = createSlice({
  name: 'appLoading',
  initialState,
  reducers: {
    showAppLoading: (state) => {
      state.loading = true;
    },
    hideAppLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showAppLoading, hideAppLoading } = appLoadingSlice.actions;

export const selectAppLoading = (state: RootState) => state.appLoading;

export default appLoadingSlice.reducer;
