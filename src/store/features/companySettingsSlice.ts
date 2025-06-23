import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { CompanySettings, CompanySettingsDTO, ErrorResponseDTO } from 'shared/models';
import { MESSAGES, ENDPOINTS, DEFAULT_COLOR_SCHEME } from 'shared/constants';
import { setError, setSuccess } from './messageSlice';

interface CompanySettingsState {
  companySettings: StateEntity<CompanySettings | undefined>;
}

const initialState: CompanySettingsState = {
  companySettings: {
    data: {
      colorSchemeId: DEFAULT_COLOR_SCHEME,
    },
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
};

export const fetchCompanySettings = createAsyncThunk<CompanySettings | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/fetchCompanySettings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanySettingsDTO>(ENDPOINTS.companySettings);

      if (data) {
        return data;
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.companySettings.notFound,
      });
    }
  }
);

export const createCompanySettings = createAsyncThunk<void, CompanySettingsDTO, { rejectValue: ErrorResponseDTO }>(
  'companySettings/createCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<CompanySettingsDTO>(ENDPOINTS.companySettings, companySettings);
      await dispatch(fetchCompanySettings()).unwrap();

      dispatch(setSuccess(MESSAGES.success.companySettings.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.create,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const editCompanySettings = createAsyncThunk<void, Omit<CompanySettingsDTO, 'id'>, { rejectValue: ErrorResponseDTO }>(
  'companySettings/editCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<CompanySettingsDTO>(ENDPOINTS.companySettings, companySettings);
      await dispatch(fetchCompanySettings()).unwrap();

      dispatch(setSuccess(MESSAGES.success.companySettings.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.update,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const deleteCompanySettings = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/deleteCompanySettings',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(ENDPOINTS.companySettings);

      dispatch(setSuccess(MESSAGES.success.companySettings.delete));
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySettings.pending, (state) => {
        state.companySettings.fetchStatus = 'loading';
      })
      .addCase(fetchCompanySettings.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.companySettings.data = undefined;
        state.companySettings.fetchStatus = 'failed';
        state.companySettings.error = action.payload;
      })
      .addCase(fetchCompanySettings.fulfilled, (state, action: PayloadAction<CompanySettingsDTO | undefined>) => {
        state.companySettings.data = action.payload;
        state.companySettings.fetchStatus = 'succeeded';
      })
      .addCase(createCompanySettings.pending, (state) => {
        state.companySettings.updateStatus = 'loading';
      })
      .addCase(createCompanySettings.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.companySettings.updateStatus = 'failed';
        state.companySettings.updateError = action.payload;
      })
      .addCase(createCompanySettings.fulfilled, (state) => {
        state.companySettings.updateStatus = 'succeeded';
        state.companySettings.updateError = undefined;
      })
      .addCase(editCompanySettings.pending, (state) => {
        state.companySettings.updateStatus = 'loading';
      })
      .addCase(editCompanySettings.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.companySettings.updateStatus = 'failed';
        state.companySettings.updateError = action.payload;
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
        state.companySettings.error = action.payload;
      })
      .addCase(deleteCompanySettings.fulfilled, (state) => {
        state.companySettings.data = undefined;
        state.companySettings.deleteStatus = 'succeeded';
      });
  },
});

export const selectCompanySettings = (state: RootState) => state.companySettings.companySettings;

export default companySettingsSlice.reducer;
