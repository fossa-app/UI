import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Client, ErrorResponse } from 'shared/models';
import { MESSAGES, ROUTES, URLS } from 'shared/constants';
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

export const fetchClient = createAsyncThunk<Client | null, void, { rejectValue: ErrorResponse }>(
  'identity/getClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get<Client>(`${URLS.client}?origin=${window.location.origin}`);

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

      return rejectWithValue({ title: MESSAGES.error.client.notFound });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClient.pending, (state) => {
        state.client.status = 'loading';
      })
      .addCase(fetchClient.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.client.data = null;
        state.client.status = 'failed';
        state.client.error = action.payload;
      })
      .addCase(fetchClient.fulfilled, (state, action: PayloadAction<Client | null>) => {
        state.client.data = action.payload;
        state.client.status = 'succeeded';
      });
  },
});

export const selectClient = (state: RootState) => state.identity.client;
export default identitySlice.reducer;
