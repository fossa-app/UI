import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Client, ErrorResponseDTO } from 'shared/models';
import { MESSAGES, ROUTES, ENDPOINTS } from 'shared/constants';
import { parseResponse } from 'shared/helpers';
import { updateAuthSettings } from './authSlice';

interface IdentityState {
  client: StateEntity<Client | undefined>;
}

const initialState: IdentityState = {
  client: {
    item: undefined,
    fetchStatus: 'idle',
  },
};

export const fetchClient = createAsyncThunk<Client | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<{ data: Client }>(`${ENDPOINTS.client}?origin=${window.location.origin}`);
      // TODO: this should be handled in AxiosInterceptor, but this method is not being called in axios response
      const parsedResponse = parseResponse<{ data: Client }>(response);

      if (parsedResponse?.data) {
        dispatch(
          updateAuthSettings({
            client_id: parsedResponse.data.clientId,
            redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
            post_logout_redirect_uri: `${window.location.origin}/`,
          })
        );

        return parsedResponse.data;
      }

      return rejectWithValue({ title: MESSAGES.error.client.notFound });
    } catch (error: any) {
      return rejectWithValue(parseResponse<{ data: ErrorResponseDTO }>(error.response).data);
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
        state.client.fetchStatus = 'loading';
      })
      .addCase(fetchClient.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.client.item = undefined;
        state.client.fetchStatus = 'failed';
        state.client.fetchError = action.payload;
      })
      .addCase(fetchClient.fulfilled, (state, action: PayloadAction<Client | undefined>) => {
        state.client.item = action.payload;
        state.client.fetchStatus = 'succeeded';
      });
  },
});

export const selectClient = (state: RootState) => state.identity.client;
export default identitySlice.reducer;
