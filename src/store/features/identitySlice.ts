import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import { fetchClient } from 'store/thunks';
import { Client, ErrorResponseDTO } from 'shared/models';

interface IdentityState {
  client: StateEntity<Client | undefined>;
}

const initialState: IdentityState = {
  client: {
    item: undefined,
    fetchStatus: 'idle',
  },
};

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
