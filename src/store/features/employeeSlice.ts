import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Employee, EmployeeDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapEmployee, mapEmployees, prepareQueryParams } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';

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
  PaginatedResponse<EmployeeDTO> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponse }
>('employee/fetchEmployees', async ({ pageNumber, pageSize, search }, { getState, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);
    const state = getState() as RootState;
    const branches = state.branch.branches.data?.items;

    if (data) {
      return {
        ...data,
        items: mapEmployees(data.items, branches),
      };
    }
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponse),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const fetchEmployeeById = createAsyncThunk<Employee, string, { rejectValue: ErrorResponse }>(
  'employee/fetchEmployeeById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<EmployeeDTO>(`${ENDPOINTS.employees}/${id}`);
      const state = getState() as RootState;
      const branches = state.branch.branches.data?.items;

      return mapEmployee(data, undefined, branches);
    } catch (error) {
      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const editEmployee = createAsyncThunk<void, [string, Pick<EmployeeDTO, 'assignedBranchId'>], { rejectValue: ErrorResponse }>(
  'employee/editEmployee',
  async ([id, employee], { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(`${ENDPOINTS.employees}/${id}`, employee);

      dispatch(setSuccess(MESSAGES.success.employee.updateEmployee));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.employee.updateEmployee,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

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
      state.employee = initialState.employee;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.employees.fetchStatus = 'loading';
      })
      .addCase(fetchEmployees.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
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
      .addCase(fetchEmployeeById.pending, (state) => {
        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployeeById.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.fetchStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action: PayloadAction<Employee | undefined>) => {
        state.employee.data = action.payload;
        state.employee.fetchStatus = 'succeeded';
      })
      .addCase(editEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(editEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.error = action.payload;
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
