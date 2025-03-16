import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Company, CompanyDTO, ErrorResponseDTO } from 'shared/models';
import { filterUniqueByField, mapCompany } from 'shared/helpers';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { setError, setSuccess } from './messageSlice';

interface CompanyState {
  company: StateEntity<Company | undefined>;
}

const initialState: CompanyState = {
  company: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchCompany = createAsyncThunk<Company | undefined, boolean | undefined, { rejectValue: ErrorResponseDTO }>(
  'company/fetchCompany',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyDTO>(ENDPOINTS.company);

      if (data) {
        const state = getState() as RootState;
        const countries = state.license.system.data?.entitlements.countries || [];

        return mapCompany(data, countries);
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

export const createCompany = createAsyncThunk<void, CompanyDTO, { rejectValue: ErrorResponseDTO }>(
  'company/createCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<CompanyDTO>(ENDPOINTS.company, company);
      await dispatch(fetchCompany(false)).unwrap();

      dispatch(setSuccess(MESSAGES.success.company.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.company.create,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const editCompany = createAsyncThunk<void, Omit<CompanyDTO, 'id'>, { rejectValue: ErrorResponseDTO }>(
  'company/editCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<CompanyDTO>(ENDPOINTS.company, company);

      dispatch(setSuccess(MESSAGES.success.company.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.company.update,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanyFetchStatus(state) {
      state.company.fetchStatus = initialState.company.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.fetchStatus = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.data = undefined;
        state.company.fetchStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<CompanyDTO | undefined>) => {
        state.company.data = action.payload;
        state.company.fetchStatus = 'succeeded';
      })
      .addCase(createCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
      })
      .addCase(editCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(editCompany.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(editCompany.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
        state.company.error = undefined;
      });
  },
});

export const selectCompany = (state: RootState) => state.company.company;

export const selectCompanyTimeZones = createSelector(
  // NOTE: always select state slices directly instead of passing selectors due to memoization issues
  [(state: RootState) => state.license.system.data?.entitlements.timeZones, (state: RootState) => state.company.company.data?.countryCode],
  (timeZones, countryCode) => {
    if (!countryCode || !timeZones?.length) {
      return [];
    }

    return filterUniqueByField(timeZones?.filter((timeZone) => timeZone.countryCode === countryCode) || [], 'name');
  }
);

export const { resetCompanyFetchStatus } = companySlice.actions;

export default companySlice.reducer;
