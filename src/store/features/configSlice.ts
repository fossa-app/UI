import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';
import { Status } from 'shared/models';
import { FUSION_AUTH_CONFIG } from 'shared/constants';
import { RootState } from 'store';

const isBrowserDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

interface ConfigState {
  fusionAuthConfig: FusionAuthProviderConfig;
  isDarkTheme: boolean;
  status: Status;
}

const initialState: ConfigState = {
  fusionAuthConfig: FUSION_AUTH_CONFIG,
  isDarkTheme: isBrowserDarkMode,
  status: 'idle',
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<Partial<ConfigState>>): ConfigState {
      return {
        ...state,
        ...action.payload,
        status: 'succeeded',
      };
    },
  },
});

export const { setConfig } = configSlice.actions;
export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
