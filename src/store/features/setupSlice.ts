import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'core/axios';
import { RootState } from 'store';
import { Company, ErrorResponse, SetupStep, StateEntity } from 'shared/models';
import { URLS } from 'shared/constants';

interface SetupState {
  company: StateEntity<Company | null>;
  step: SetupStep;
}

const initialState: SetupState = {
  company: {
    data: null,
    status: 'idle',
  },
  step: SetupStep.COMPANY,
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

export const createCompany = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'setup/setCompany',
  async (company, { rejectWithValue }) => {
    try {
      await axios.post<Company>(URLS.company, { name: company });
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
        state.step = SetupStep.BRANCHES;
      })
      .addCase(createCompany.pending, (state) => {
        state.company.status = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.company.status = 'succeeded';
        state.step = SetupStep.BRANCHES;
      });
  },
});

export const selectCompany = (state: RootState) => state.setup.company;
export const selectStep = (state: RootState) => state.setup.step;
export default setupSlice.reducer;
