import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { RootState } from 'store';
import { Company, ErrorResponse, StateEntity } from 'shared/models';
import { URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
}

const initialState: SetupState = {
  company: {
    data: null,
    status: 'idle',
  },
};

export const fetchCompany = createAsyncThunk<Company | null, void, { rejectValue: ErrorResponse }>(
  'setup/fetchCompany',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Company>(URLS.company);
      return data || rejectWithValue({ title: 'No company found' });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.status = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company | null>) => {
        state.company.data = action.payload;
        state.company.status = 'succeeded';
      });
  },
});

export const selectCompany = (state: RootState) => state.setup.company;
export default setupSlice.reducer;
