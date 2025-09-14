import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { FieldValues } from 'react-hook-form';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import {
  BranchDTO,
  Company,
  CompanyDatasourceTotals,
  CompanyDTO,
  DepartmentDTO,
  EmployeeDTO,
  ErrorResponse,
  ErrorResponseDTO,
  PaginatedResponse,
} from 'shared/models';
import { calculateUsagePercent, filterUniqueByField, mapCompany, mapError } from 'shared/helpers';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { setError, setSuccess } from './messageSlice';
import { fetchBranchesTotal } from './branchSlice';
import { fetchEmployeesTotal } from './employeeSlice';
import { fetchDepartmentsTotal } from './departmentSlice';

interface CompanyState {
  company: StateEntity<Company | undefined>;
  companyDatasourceTotals: StateEntity<CompanyDatasourceTotals>;
}

const initialState: CompanyState = {
  company: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  companyDatasourceTotals: {
    fetchStatus: 'idle',
    item: {
      branches: undefined,
      employees: undefined,
      departments: undefined,
    },
  },
};

export const fetchCompany = createAsyncThunk<Company | undefined, boolean | undefined, { rejectValue: ErrorResponseDTO }>(
  'company/fetchCompany',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyDTO>(ENDPOINTS.company);

      if (data) {
        const state = getState() as RootState;
        const countries = state.license.system.item?.entitlements.countries || [];

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

export const createCompany = createAsyncThunk<void, CompanyDTO, { rejectValue: ErrorResponse<FieldValues> }>(
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

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editCompany = createAsyncThunk<void, Omit<CompanyDTO, 'id'>, { rejectValue: ErrorResponse<FieldValues> }>(
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

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteCompany = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'company/deleteCompany',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(ENDPOINTS.company);

      dispatch(setSuccess(MESSAGES.success.company.delete));

      try {
        await dispatch(fetchCompany()).unwrap();
      } catch {
        // Ignored: fetchCompany will return 404 after delete, which is expected.
      }
    } catch (error) {
      if ((error as ErrorResponseDTO).status === 424) {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.company.deleteDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.company.delete,
          })
        );
      }

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const fetchCompanyDatasourceTotals = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'company/fetchCompanyDatasourceTotals',
  async (_, { dispatch }) => {
    try {
      await dispatch(fetchBranchesTotal()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchEmployeesTotal()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchDepartmentsTotal()).unwrap();
    } catch {
      // We expect an error here
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
    resetCompanyDatasourceTotalsFetchStatus(state) {
      state.companyDatasourceTotals.fetchStatus = initialState.companyDatasourceTotals.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.company.fetchStatus = 'loading';
      })
      .addCase(fetchCompany.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.item = undefined;
        state.company.fetchStatus = 'failed';
        state.company.fetchError = action.payload;
      })
      .addCase(fetchCompany.fulfilled, (state, action: PayloadAction<CompanyDTO | undefined>) => {
        state.company.item = action.payload;
        state.company.fetchStatus = 'succeeded';
      })
      .addCase(createCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(createCompany.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createCompany.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
        state.company.updateError = undefined;
      })
      .addCase(editCompany.pending, (state) => {
        state.company.updateStatus = 'loading';
      })
      .addCase(editCompany.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.company.updateStatus = 'failed';
        state.company.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editCompany.fulfilled, (state) => {
        state.company.updateStatus = 'succeeded';
        state.company.updateError = undefined;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.company.deleteStatus = 'loading';
      })
      .addCase(deleteCompany.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.company.deleteStatus = 'failed';
        state.company.deleteError = action.payload;
      })
      .addCase(deleteCompany.fulfilled, (state) => {
        state.company.item = undefined;
        state.company.deleteStatus = 'succeeded';
      })
      .addCase(fetchBranchesTotal.rejected, (state) => {
        state.companyDatasourceTotals.item.branches = 0;
      })
      .addCase(fetchEmployeesTotal.rejected, (state) => {
        state.companyDatasourceTotals.item.employees = 0;
      })
      .addCase(fetchDepartmentsTotal.rejected, (state) => {
        state.companyDatasourceTotals.item.departments = 0;
      })
      .addCase(fetchBranchesTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<BranchDTO> | undefined>) => {
        state.companyDatasourceTotals.item.branches = action.payload?.totalItems;
      })
      .addCase(fetchEmployeesTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<EmployeeDTO> | undefined>) => {
        state.companyDatasourceTotals.item.employees = action.payload?.totalItems;
      })
      .addCase(fetchDepartmentsTotal.fulfilled, (state, action: PayloadAction<PaginatedResponse<DepartmentDTO> | undefined>) => {
        state.companyDatasourceTotals.item.departments = action.payload?.totalItems;
      })
      .addCase(fetchCompanyDatasourceTotals.pending, (state) => {
        state.companyDatasourceTotals.fetchStatus = 'loading';
      })
      .addCase(fetchCompanyDatasourceTotals.rejected, (state) => {
        state.companyDatasourceTotals.fetchStatus = 'failed';
      })
      .addCase(fetchCompanyDatasourceTotals.fulfilled, (state) => {
        state.companyDatasourceTotals.fetchStatus = 'succeeded';
      });
  },
});

export const selectCompany = (state: RootState) => state.company.company;

export const selectCompanyTimeZones = createSelector(
  // NOTE: always select state slices directly instead of passing selectors due to memoization issues
  [(state: RootState) => state.license.system.item?.entitlements.timeZones, (state: RootState) => state.company.company.item?.countryCode],
  (timeZones, countryCode) => {
    if (!countryCode || !timeZones?.length) {
      return [];
    }

    return filterUniqueByField(timeZones?.filter((timeZone) => timeZone.countryCode === countryCode) || [], 'name');
  }
);

export const selectCompanyDatasourceTotals = (state: RootState) => state.company.companyDatasourceTotals;

export const selectBranchUsagePercent = createSelector(
  [
    (state: RootState) => state.company.companyDatasourceTotals.item.branches,
    (state: RootState) => state.license.company.item?.entitlements.maximumBranchCount,
  ],
  (branches, maximumBranchCount) => calculateUsagePercent(branches, maximumBranchCount)
);

export const selectEmployeeUsagePercent = createSelector(
  [
    (state: RootState) => state.company.companyDatasourceTotals.item.employees,
    (state: RootState) => state.license.company.item?.entitlements.maximumEmployeeCount,
  ],
  (employees, maximumEmployeeCount) => calculateUsagePercent(employees, maximumEmployeeCount)
);

export const selectDepartmentUsagePercent = createSelector(
  [
    (state: RootState) => state.company.companyDatasourceTotals.item.departments,
    (state: RootState) => state.license.company.item?.entitlements.maximumDepartmentCount,
  ],
  (departments, maximumDepartmentCount) => calculateUsagePercent(departments, maximumDepartmentCount)
);

export const selectCompanyLicenseLoading = createSelector(
  [(state: RootState) => state.license.company.fetchStatus, (state: RootState) => state.company.companyDatasourceTotals.fetchStatus],
  (companyLicenseFetchStatus, companyDatasourceTotalsFetchStatus) =>
    companyLicenseFetchStatus === 'idle' ||
    companyLicenseFetchStatus === 'loading' ||
    companyDatasourceTotalsFetchStatus === 'idle' ||
    companyDatasourceTotalsFetchStatus === 'loading'
);

export const { resetCompanyFetchStatus, resetCompanyDatasourceTotalsFetchStatus } = companySlice.actions;

export default companySlice.reducer;
