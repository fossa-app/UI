import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Client, ErrorResponseDTO } from 'shared/models';
import { MESSAGES, ROUTES, ENDPOINTS } from 'shared/constants';
import { parseResponseData } from 'shared/helpers';
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

export const fetchClient = createAsyncThunk<Client | null, void, { rejectValue: ErrorResponseDTO }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get<Client>(`${ENDPOINTS.client}?origin=${window.location.origin}`);
      // TODO: this should be handled in AxiosInterceptor, but this method is not being called in axios response
      const parsedData = parseResponseData<Client>(data);

      if (parsedData) {
        dispatch(
          updateAuthSettings({
            client_id: parsedData.clientId,
            redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
            post_logout_redirect_uri: `${window.location.origin}/`,
          })
        );

        return parsedData;
      }

      return rejectWithValue({ title: MESSAGES.error.client.notFound });
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO);
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
      .addCase(fetchClient.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
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
