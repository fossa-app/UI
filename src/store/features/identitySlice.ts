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

export const fetchClient = createAsyncThunk<Client | null, void, { rejectValue: ErrorResponse }>(
  'identity/fetchClient',
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
      return rejectWithValue({ title: 'Client not found' });
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
