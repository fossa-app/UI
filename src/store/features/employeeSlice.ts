import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import {
  Branch,
  BranchDTO,
  Employee,
  EmployeeDTO,
  ErrorResponse,
  ErrorResponseDTO,
  PaginatedResponse,
  PaginationParams,
} from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import {
  mapEmployee,
  mapEmployees,
  prepareQueryParams,
  getEmployeesAssignedBranchIds,
  mapError,
  prepareCommaSeparatedQueryParamsByKey,
} from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchBranchById, fetchBranchesByIds } from './branchSlice';

interface EmployeeState {
  employees: StateEntity<PaginatedResponse<Employee> | undefined>;
  employee: StateEntity<Employee | undefined>;
}

const initialState: EmployeeState = {
  employees: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
  employee: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
};

export const fetchEmployees = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  [Partial<PaginationParams>, boolean?],
  { rejectValue: ErrorResponseDTO }
>('employee/fetchEmployees', async ([{ pageNumber, pageSize, search }, shouldFetchBranches = true], { dispatch, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

    if (data) {
      const assignedBranchIds = getEmployeesAssignedBranchIds(data.items);
      let branches: PaginatedResponse<BranchDTO> | undefined;

      if (shouldFetchBranches && assignedBranchIds.length) {
        branches = await dispatch(fetchBranchesByIds(assignedBranchIds)).unwrap();
      }

      return {
        ...data,
        items: mapEmployees(data.items, branches?.items),
      };
    }
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const fetchEmployeeById = createAsyncThunk<
  Employee,
  { id: string; skipState?: boolean; shouldFetchBranch?: boolean },
  { rejectValue: ErrorResponseDTO }
>('employee/fetchEmployeeById', async ({ id, shouldFetchBranch = true }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.get<EmployeeDTO>(`${ENDPOINTS.employees}/${id}`);
    let branch: Branch | undefined;

    if (data.assignedBranchId && shouldFetchBranch) {
      branch = await dispatch(fetchBranchById({ id: String(data.assignedBranchId), skipState: true })).unwrap();
    }

    return mapEmployee(data, undefined, branch);
  } catch (error) {
    return rejectWithValue(error as ErrorResponseDTO);
  }
});

export const fetchEmployeesByIds = createAsyncThunk<
  PaginatedResponse<EmployeeDTO> | undefined,
  number[],
  { rejectValue: ErrorResponseDTO }
>('employee/fetchEmployeesByIds', async (ids, { rejectWithValue }) => {
  try {
    const queryParams = prepareCommaSeparatedQueryParamsByKey('id', ids);
    const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const editEmployee = createAsyncThunk<
  void,
  [string, Pick<EmployeeDTO, 'assignedBranchId'>],
  { rejectValue: ErrorResponse<FieldValues> }
>('employee/editEmployee', async ([id, employee], { dispatch, rejectWithValue }) => {
  try {
    await axios.put<void>(`${ENDPOINTS.employees}/${id}`, employee);

    dispatch(setSuccess(MESSAGES.success.employee.updateEmployee));
  } catch (error) {
    dispatch(
      setError({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.updateEmployee,
      })
    );

    const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

    return rejectWithValue(mappedError);
  }
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.employees.page = { ...state.employees.page, ...action.payload };
    },
    resetEmployeesPagination(state) {
      state.employees.page = initialState.employees.page;
    },
    resetEmployeesFetchStatus(state) {
      state.employees.fetchStatus = initialState.employees.fetchStatus;
    },
    resetEmployee(state) {
      state.employee = initialState.employee as WritableDraft<StateEntity<Employee>>;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.employees.fetchStatus = 'loading';
      })
      .addCase(fetchEmployees.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.employees.data = undefined;
        state.employees.fetchStatus = 'failed';
        state.employees.error = action.payload;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<Employee> | undefined>) => {
        state.employees.data = action.payload;
        state.employees.page!.totalItems = action.payload?.totalItems;
        state.employees.page!.totalPages = action.payload?.totalPages;
        state.employees.fetchStatus = 'succeeded';
      })
      .addCase(fetchEmployeeById.pending, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.data = undefined;
        state.employee.fetchStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.employee.data = action.payload;
        state.employee.fetchStatus = 'succeeded';
        state.employee.error = undefined;
      })
      .addCase(editEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(editEmployee.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
      });
  },
});

export const selectEmployees = (state: RootState) => state.employee.employees;
export const selectEmployee = (state: RootState) => state.employee.employee;

export const { setEmployeesPagination, resetEmployeesPagination, resetEmployeesFetchStatus, resetEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
