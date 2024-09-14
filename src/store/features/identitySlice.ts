import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { Client, ErrorResponse, Status } from 'shared/models';
import { URLS } from 'shared/constants';
import { getBackendOrigin } from 'shared/helpers';
import store, { RootState } from 'store';
import { setFusionAuthConfig } from './configSlice';

interface IdentityState {
  client: Client | null;
  status: Status;
  error?: ErrorResponse;
}

const initialState: IdentityState = {
  client: null,
  status: 'idle',
};

export const getClient = createAsyncThunk<
  Client | null,
  string,
  { rejectValue: ErrorResponse }
>('identity/getClient', async (origin, { dispatch, rejectWithValue }) => {
  const beOrigin = getBackendOrigin(origin);
  const url = `${beOrigin}/${URLS.base}/${URLS.client}?origin=${origin}`;

  try {
    const { data } = await axios.get<Client>(url);

    if (data) {
      const { fusionAuthConfig } = store.getState().config;

      dispatch(
        setFusionAuthConfig({
          ...fusionAuthConfig,
          clientId: data.clientId,
          redirectUri: origin,
          postLogoutRedirectUri: origin,
        })
      );

      return data;
    }

    return null;
  } catch (error) {
    return rejectWithValue(error as ErrorResponse);
  }
});

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setClient(state, action: PayloadAction<Client>): IdentityState {
      return {
        ...state,
        client: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getClient.pending, (state): IdentityState => {
        return {
          ...state,
          status: 'loading',
        };
      })
      .addCase(
        getClient.rejected,
        (
          state,
          action: PayloadAction<ErrorResponse | undefined>
        ): IdentityState => {
          return {
            ...state,
            status: 'failed',
            error: action.payload,
          };
        }
      )
      .addCase(
        getClient.fulfilled,
        (state, action: PayloadAction<Client | null>): IdentityState => {
          return {
            ...state,
            client: action.payload,
            status: 'succeeded',
          };
        }
      );
  },
});

export const { setClient } = identitySlice.actions;
export const selectIdentity = (state: RootState) => state.identity;

export default identitySlice.reducer;
