import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { Client, ErrorResponse, Status } from 'shared/models';
import { URLS } from 'shared/constants';
import store, { RootState } from 'store';
import { setConfig } from './configSlice';

interface IdentityState {
  client: Client | null;
  status: Status;
  error?: ErrorResponse;
}

const initialState: IdentityState = {
  client: null,
  status: 'idle',
};

export const fetchClient = createAsyncThunk<
  Client | null,
  void,
  { rejectValue: ErrorResponse }
>('identity/fetchClient', async (_, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.get<Client>(
      `${URLS.client}?origin=${window.location.origin}`
    );

    if (data) {
      const config = store.getState().config;

      dispatch(
        setConfig({
          ...config,
          fusionAuthConfig: {
            ...config.fusionAuthConfig,
            clientId: data.clientId,
            redirectUri: origin,
            postLogoutRedirectUri: origin,
          },
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
      .addCase(fetchClient.pending, (state): IdentityState => {
        return {
          ...state,
          status: 'loading',
        };
      })
      .addCase(
        fetchClient.rejected,
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
        fetchClient.fulfilled,
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
