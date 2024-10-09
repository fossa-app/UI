import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios.config';
import { ErrorResponse, StateEntity, System } from 'shared/models';
import { URLS } from 'shared/constants';
import { RootState } from 'store';

interface LicenseState {
  system: StateEntity<System | null>;
}

const initialState: LicenseState = {
  system: {
    data: null,
    status: 'idle',
  },
};

export const fetchSystem = createAsyncThunk<System | null, void, { rejectValue: ErrorResponse }>(
  'license/fetchSystem',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<System>(URLS.system);
      return data || rejectWithValue({ title: 'System not found' });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const licenseSlice = createSlice({
  name: 'license',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystem.pending, (state) => {
        state.system.status = 'loading';
      })
      .addCase(fetchSystem.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.system.data = null;
        state.system.status = 'failed';
        state.system.error = action.payload;
      })
      .addCase(fetchSystem.fulfilled, (state, action: PayloadAction<System | null>) => {
        state.system.data = action.payload;
        state.system.status = 'succeeded';
      });
  },
});

export const selectSystem = (state: RootState) => state.license.system;
export default licenseSlice.reducer;
