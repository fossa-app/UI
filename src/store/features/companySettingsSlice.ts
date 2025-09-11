import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { CompanySettings, CompanySettingsDTO, ErrorResponse, ErrorResponseDTO } from 'shared/models';
import { MESSAGES, ENDPOINTS, COMPANY_SETTINGS_KEY } from 'shared/constants';
import { mapError, saveToLocalStorage, removeFromLocalStorage } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';

interface CompanySettingsState {
  companySettings: StateEntity<CompanySettings>;
  previewColorSchemeId?: CompanySettings['colorSchemeId'];
}

const initialState: CompanySettingsState = {
  companySettings: {
    item: {
      colorSchemeId: undefined,
    },
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  previewColorSchemeId: undefined,
};

export const fetchCompanySettings = createAsyncThunk<CompanySettings, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/fetchCompanySettings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanySettingsDTO>(ENDPOINTS.companySettings);

      saveToLocalStorage(COMPANY_SETTINGS_KEY, data);

      return data || {};
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.companySettings.notFound,
      });
    }
  }
);

export const createCompanySettings = createAsyncThunk<void, CompanySettingsDTO, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/createCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<CompanySettingsDTO>(ENDPOINTS.companySettings, companySettings);
      saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
      await dispatch(fetchCompanySettings()).unwrap();

      dispatch(setSuccess(MESSAGES.success.companySettings.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editCompanySettings = createAsyncThunk<void, Omit<CompanySettingsDTO, 'id'>, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/editCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<CompanySettingsDTO>(ENDPOINTS.companySettings, companySettings);

      await dispatch(fetchCompanySettings()).unwrap();

      saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
      dispatch(setSuccess(MESSAGES.success.companySettings.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteCompanySettings = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/deleteCompanySettings',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(ENDPOINTS.companySettings);

      removeFromLocalStorage(COMPANY_SETTINGS_KEY);
      dispatch(setSuccess(MESSAGES.success.companySettings.delete));
      try {
        await dispatch(fetchCompanySettings()).unwrap();
      } catch {
        // Ignored: fetchCompanySettings will return 404 after delete, which is expected.
      }
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.delete,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

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
