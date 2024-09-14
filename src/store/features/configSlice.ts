import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FusionAuthProviderConfig } from '@fusionauth/react-sdk';
import { Status } from 'shared/models';
import { FUSION_AUTH_CONFIG } from 'shared/constants';
import { RootState } from 'store';

interface ConfigState {
  fusionAuthConfig: FusionAuthProviderConfig;
  status: Status;
}

const initialState: ConfigState = {
  fusionAuthConfig: FUSION_AUTH_CONFIG,
  status: 'idle',
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setFusionAuthConfig(
      state,
      action: PayloadAction<FusionAuthProviderConfig>
    ): ConfigState {
      return {
        ...state,
        fusionAuthConfig: action.payload,
      };
    },
  },
});

export const { setFusionAuthConfig } = configSlice.actions;
export const selectFusionAuthConfig = (state: RootState) => state.config;

export default configSlice.reducer;
