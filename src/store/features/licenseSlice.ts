import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'shared/configs/axios';
import { CompanyLicense, ErrorResponse, SystemLicense } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';
import { RootState, StateEntity } from 'store';

interface LicenseState {
  system: StateEntity<SystemLicense | null>;
  company: StateEntity<CompanyLicense | null>;
}

const initialState: LicenseState = {
  system: {
    data: null,
    status: 'idle',
  },
  company: {
    data: null,
    status: 'idle',
  },
};

export const fetchSystemLicense = createAsyncThunk<SystemLicense | null, void, { rejectValue: ErrorResponse }>(
  'license/getSystemLicense',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<SystemLicense>(URLS.systemLicense);

      return data || rejectWithValue({ title: MESSAGES.error.license.system.notFound });
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const fetchCompanyLicense = createAsyncThunk<CompanyLicense | null, void, { rejectValue: ErrorResponse }>(
  'license/getCompanyLicense',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyLicense>(URLS.companyLicense);

      return data || rejectWithValue({ title: MESSAGES.error.license.company.notFound });
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
      .addCase(fetchSystemLicense.pending, (state) => {
        state.system.status = 'loading';
      })
      .addCase(fetchSystemLicense.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.system.data = null;
        state.system.status = 'failed';
        state.system.error = action.payload;
      })
      .addCase(fetchSystemLicense.fulfilled, (state, action: PayloadAction<SystemLicense | null>) => {
        state.system.data = action.payload;
        state.system.status = 'succeeded';
      })
      .addCase(fetchCompanyLicense.pending, (state) => {
        state.company.status = 'loading';
      })
      .addCase(fetchCompanyLicense.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.status = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompanyLicense.fulfilled, (state, action: PayloadAction<CompanyLicense | null>) => {
        state.company.data = action.payload;
        state.company.status = 'succeeded';
      });
  },
});

export const selectSystemLicense = (state: RootState) => state.license.system;
export const selectCompanyLicense = (state: RootState) => state.license.company;
export default licenseSlice.reducer;
