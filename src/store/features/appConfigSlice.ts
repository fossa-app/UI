import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { Status } from 'shared/models';

const isBrowserDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

interface ConfigState {
  isDarkTheme: boolean;
  status: Status;
}

const initialState: ConfigState = {
  isDarkTheme: isBrowserDarkMode,
  status: 'idle',
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    updateAppConfig(state, action: PayloadAction<Partial<ConfigState>>): ConfigState {
      return {
        ...state,
        ...action.payload,
        status: 'succeeded',
      };
    },
  },
});

export const { updateAppConfig } = appConfigSlice.actions;

export const selectAppConfig = (state: RootState) => state.appConfig;

export default appConfigSlice.reducer;
