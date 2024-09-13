import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from 'shared/models';
import type { RootState } from '../index';

interface ClientState {
  client: Client | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ClientState = {
  client: null,
  status: 'idle',
};

export const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setClient(state, action: PayloadAction<Client>): ClientState {
      return {
        ...state,
        client: action.payload,
      };
    },
  },
});

export const { setClient } = clientSlice.actions;
export const selectClient = (state: RootState) => state.client;

export default clientSlice.reducer;
