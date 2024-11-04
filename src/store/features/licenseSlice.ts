import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'shared/configs/axios';
import { CompanyLicense, ErrorResponse, SystemLicense } from 'shared/models';
import { MESSAGES, URLS } from 'shared/constants';
import { RootState, StateEntity } from 'store';
import { setError } from './errorSlice';

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
    updateStatus: 'idle',
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

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.license.company.notFound,
      });
    }
  }
);

export const uploadCompanyLicense = createAsyncThunk<CompanyLicense | null, File, { rejectValue: ErrorResponse }>(
  'license/uploadCompanyLicense',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append('licenseFile', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post<CompanyLicense>(URLS.companyLicense, formData, config);
      await dispatch(fetchCompanyLicense()).unwrap();

      return data || null;
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.license.company.createFailed,
        })
      );

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
      })
      .addCase(uploadCompanyLicense.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(uploadCompanyLicense.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.data = null;
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(uploadCompanyLicense.fulfilled, (state, action: PayloadAction<CompanyLicense | null>) => {
        state.company.data = action.payload;
        state.company.updateStatus = 'succeeded';
      });
  },
});

export const selectSystemLicense = (state: RootState) => state.license.system;
export const selectCompanyLicense = (state: RootState) => state.license.company;
export default licenseSlice.reducer;
