import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Company, ErrorResponse } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';
import { setError } from './errorSlice';

interface CompanyState {
  company: StateEntity<Company | null>;
}

const initialState: CompanyState = {
  company: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchCompany = createAsyncThunk<Company | null, boolean | undefined, { rejectValue: ErrorResponse }>(
  'company/getCompany',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Company>(URLS.company);

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

export const createCompany = createAsyncThunk<Company, Company, { rejectValue: ErrorResponse }>(
  'company/setCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<Company>(URLS.company, company);
      await dispatch(fetchCompany(false)).unwrap();

      return company;
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.company.createFailed,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.fetchStatus = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.fetchStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<Company | null>) => {
        state.company.data = action.payload;
        state.company.fetchStatus = 'succeeded';
      })
      .addCase(createCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.company.updateStatus = 'succeeded';
        state.company.data = action.payload;
      });
  },
});

export const selectCompany = (state: RootState) => state.company.company;
export default companySlice.reducer;
