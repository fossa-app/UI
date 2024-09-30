import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { RootState } from 'store';
import { Client, ErrorResponse, StateEntity } from 'shared/models';
import { ROUTES, URLS } from 'shared/constants';
import { updateAuthSettings } from './authSlice';

interface IdentityState {
  client: StateEntity<Client | null>;
}

const initialState: IdentityState = {
  client: {
    data: null,
    status: 'idle',
  },
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
      dispatch(
        updateAuthSettings({
          client_id: data.clientId,
          redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
          post_logout_redirect_uri: `${window.location.origin}/`,
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
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchClient.pending, (state): IdentityState => {
        return {
          ...state,
          client: {
            ...state.client,
            status: 'loading',
          },
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
            client: {
              ...state.client,
              data: null,
              status: 'failed',
              error: action.payload,
            },
          };
        }
      )
      .addCase(
        fetchClient.fulfilled,
        (state, action: PayloadAction<Client | null>): IdentityState => {
          return {
            ...state,
            client: {
              ...state.client,
              data: action.payload,
              status: 'succeeded',
            },
          };
        }
      );
  },
});

export const selectClient = (state: RootState) => state.identity.client;

export default identitySlice.reducer;
