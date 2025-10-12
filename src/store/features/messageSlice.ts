import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ErrorResponseDTO } from 'shared/types';

interface MessageState {
  error: ErrorResponseDTO | undefined;
  success: string | undefined;
}

const initialState: MessageState = {
  error: undefined,
  success: undefined,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorResponseDTO>) => {
      state.error = action.payload;
      state.success = undefined;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.success = action.payload;
      state.error = undefined;
    },
    clearMessages: (state) => {
      state.error = undefined;
      state.success = undefined;
    },
  },
});

export const { setError, setSuccess, clearMessages } = messageSlice.actions;

export const selectMessage = (state: RootState) => state.message;

export default messageSlice.reducer;
