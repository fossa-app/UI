import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { CompanyLicense, ErrorResponse, ErrorResponseDTO, SystemLicense } from 'shared/models';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapCompanyLicense, mapError, parseResponse } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';

interface LicenseState {
  system: StateEntity<SystemLicense | undefined>;
  company: StateEntity<CompanyLicense | undefined>;
}

const initialState: LicenseState = {
  system: {
    item: undefined,
    fetchStatus: 'idle',
  },
  company: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchSystemLicense = createAsyncThunk<SystemLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchSystemLicense',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ data: SystemLicense }>(ENDPOINTS.systemLicense);
      // TODO: this should be handled in AxiosInterceptor, but this method is not being called in axios response
      const parsedResponse = parseResponse<{ data: SystemLicense }>(response);

      return parsedResponse.data || rejectWithValue({ title: MESSAGES.error.license.system.notFound });
    } catch (error: any) {
      return rejectWithValue(parseResponse<{ data: ErrorResponseDTO }>(error.response).data);
    }
  }
);

export const fetchCompanyLicense = createAsyncThunk<CompanyLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchCompanyLicense',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyLicense>(ENDPOINTS.companyLicense);

      return mapCompanyLicense(data);
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.license.company.notFound,
      });
    }
  }
);

export const uploadCompanyLicense = createAsyncThunk<void, File, { rejectValue: ErrorResponse<FieldValues> }>(
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

      await axios.post<CompanyLicense>(ENDPOINTS.companyLicense, formData, config);
      dispatch(fetchCompanyLicense());
      dispatch(setSuccess(MESSAGES.success.license.company.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.license.company.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
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
        state.system.fetchStatus = 'loading';
      })
      .addCase(fetchSystemLicense.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.system.item = undefined;
        state.system.fetchStatus = 'failed';
        state.system.fetchError = action.payload;
      })
      .addCase(fetchSystemLicense.fulfilled, (state, action: PayloadAction<SystemLicense | undefined>) => {
        state.system.item = action.payload;
        state.system.fetchStatus = 'succeeded';
      })
      .addCase(fetchCompanyLicense.pending, (state) => {
        state.company.fetchStatus = 'loading';
      })
      .addCase(fetchCompanyLicense.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.item = undefined;
        state.company.fetchStatus = 'failed';
        state.company.fetchError = action.payload;
      })
      .addCase(fetchCompanyLicense.fulfilled, (state, action: PayloadAction<CompanyLicense | undefined>) => {
        state.company.item = action.payload;
        state.company.fetchStatus = 'succeeded';
      })
      .addCase(uploadCompanyLicense.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(uploadCompanyLicense.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.company.item = undefined;
        state.company.updateStatus = 'failed';
        state.company.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(uploadCompanyLicense.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
        state.company.updateError = undefined;
      });
  },
});

export const selectSystemLicense = (state: RootState) => state.license.system;
export const selectCompanyLicense = (state: RootState) => state.license.company;
export const selectSystemCountries = (state: RootState) => state.license.system.item?.entitlements?.countries;
export default licenseSlice.reducer;
