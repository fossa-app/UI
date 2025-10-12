import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import { createCompanySettings, deleteCompanySettings, editCompanySettings, fetchCompanySettings } from 'store/thunks';
import { CompanySettings, CompanySettingsDTO, ErrorResponse, ErrorResponseDTO } from 'shared/types';

interface CompanySettingsState {
  companySettings: StateEntity<CompanySettings>;
  previewColorSchemeId?: CompanySettings['colorSchemeId'];
}

const initialState: CompanySettingsState = {
  companySettings: {
    item: {
      colorSchemeId: undefined,
    } as CompanySettings,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  previewColorSchemeId: undefined,
};

const companySettingsSlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setPreviewCompanyColorSchemeSettings: (state, action: PayloadAction<CompanySettings['colorSchemeId'] | undefined>) => {
      state.previewColorSchemeId = action.payload;
    },
    resetPreviewCompanyColorSchemeSettings: (state) => {
      state.previewColorSchemeId = initialState.previewColorSchemeId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySettings.pending, (state) => {
        state.companySettings.fetchStatus = 'loading';
      })
      .addCase(fetchCompanySettings.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.companySettings.fetchStatus = 'failed';
        state.companySettings.fetchError = action.payload;
      })
      .addCase(fetchCompanySettings.fulfilled, (state, action: PayloadAction<CompanySettingsDTO>) => {
        state.companySettings.item = action.payload;
        state.companySettings.fetchStatus = 'succeeded';
      })
      .addCase(createCompanySettings.pending, (state) => {
        state.companySettings.updateStatus = 'loading';
      })
      .addCase(createCompanySettings.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.companySettings.updateStatus = 'failed';
        state.companySettings.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createCompanySettings.fulfilled, (state) => {
        state.companySettings.updateStatus = 'succeeded';
        state.companySettings.updateError = undefined;
      })
      .addCase(editCompanySettings.pending, (state) => {
        state.companySettings.updateStatus = 'loading';
      })
      .addCase(editCompanySettings.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.companySettings.updateStatus = 'failed';
        state.companySettings.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editCompanySettings.fulfilled, (state) => {
        state.companySettings.updateStatus = 'succeeded';
        state.companySettings.updateError = undefined;
      })
      .addCase(deleteCompanySettings.pending, (state) => {
        state.companySettings.deleteStatus = 'loading';
      })
      .addCase(deleteCompanySettings.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.companySettings.deleteStatus = 'failed';
        state.companySettings.fetchError = action.payload;
      })
      .addCase(deleteCompanySettings.fulfilled, (state) => {
        state.companySettings.item = initialState.companySettings.item;
        state.previewColorSchemeId = initialState.previewColorSchemeId;
        state.companySettings.deleteStatus = 'succeeded';
      });
  },
});

export const selectCompanySettings = (state: RootState) => state.companySettings.companySettings;
export const selectPreviewColorSchemeId = (state: RootState) => state.companySettings.previewColorSchemeId;

export const { setPreviewCompanyColorSchemeSettings, resetPreviewCompanyColorSchemeSettings } = companySettingsSlice.actions;

export default companySettingsSlice.reducer;
