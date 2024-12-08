import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { CompanyDTO, ErrorResponse } from 'shared/models';
import { filterUniqueByField } from 'shared/helpers';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { setError } from './errorSlice';

interface CompanyState {
  company: StateEntity<CompanyDTO | undefined>;
}

const initialState: CompanyState = {
  company: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchCompany = createAsyncThunk<CompanyDTO | undefined, boolean | undefined, { rejectValue: ErrorResponse }>(
  'company/getCompany',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyDTO>(ENDPOINTS.company);

      if (data) {
        // TODO: this is a temporary workaround to replace {name, code} field with countryCode, should be removed
        if (data.countryCode) {
          return data;
        }
        const { country, ...restData } = data as any;
        return { ...restData, countryCode: country?.code };
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

export const createCompany = createAsyncThunk<void, CompanyDTO, { rejectValue: ErrorResponse }>(
  'company/setCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<CompanyDTO>(ENDPOINTS.company, company);
      await dispatch(fetchCompany(false)).unwrap();
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
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
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

    const res = filterUniqueByField(
      timeZones?.filter((timeZone) => {
        // TODO: remove this check
        if (timeZone.countryCode) {
          return timeZone.countryCode === countryCode;
        }
        // TODO: replace (timeZone as any).country with timeZones.countryCode when the BE changes
        return (timeZone as any).country.code === countryCode;
      }) || [],
      'name'
    );
    return res;
  }
);

export default companySlice.reducer;
