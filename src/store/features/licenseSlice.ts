import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { fetchCompanyLicense, fetchSystemLicense, uploadCompanyLicense } from 'store/thunks';
import { CompanyLicense, ErrorResponse, ErrorResponseDTO, SystemLicense } from 'shared/models';

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
