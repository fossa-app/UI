import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ErrorResponse } from 'shared/models';

// TODO: show all visible error messages
interface EntityErrorState {
  error: ErrorResponse | null;
}

const initialState: EntityErrorState = {
  error: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorResponse>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export const selectError = (state: RootState) => state.error;

export default errorSlice.reducer;
