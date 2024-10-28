import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { Employee, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, URLS } from 'shared/constants';

interface SetupState {
  employee: StateEntity<Employee | null>;
  employees: StateEntity<PaginatedResponse<Employee> | null>;
}

const initialState: SetupState = {
  employee: {
    data: null,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  employees: {
    data: null,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

export const fetchEmployee = createAsyncThunk<Employee | null, void, { rejectValue: ErrorResponse }>(
  'employee/getEmployee',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Employee>(URLS.employee);

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const fetchEmployees = createAsyncThunk<PaginatedResponse<Employee> | null, PaginationParams, { rejectValue: ErrorResponse }>(
  'employee/getEmployees',
  async ({ pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<PaginatedResponse<Employee>>(`${URLS.employees}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const createEmployee = createAsyncThunk<void, [Employee, boolean?], { state: RootState; rejectValue: ErrorResponse }>(
  'employee/setEmployee',
  async ([employee, shouldFetchEmployees = true], { dispatch, getState, rejectWithValue }) => {
    try {
      await axios.post<void>(URLS.employee, employee);

      if (shouldFetchEmployees) {
        const { pageNumber, pageSize } = getState().employee.employees.page!;

        await dispatch(fetchEmployees({ pageNumber, pageSize })).unwrap();
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.employee.createFailed,
      });
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeesPagination(state, action: PayloadAction<PaginationParams>) {
      state.employees.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.data = null;
        state.employee.fetchStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee | null>) => {
        state.employee.data = action.payload;
        state.employee.fetchStatus = 'succeeded';
      })
      .addCase(createEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(createEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.employees.fetchStatus = 'loading';
      })
      .addCase(fetchEmployees.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employees.data = null;
        state.employees.fetchStatus = 'failed';
        state.employees.error = action.payload;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<Employee> | null>) => {
        state.employees.data = action.payload;
        state.employees.page!.totalItems = action.payload?.totalItems;
        state.employees.page!.totalPages = action.payload?.totalPages;
        state.employees.fetchStatus = 'succeeded';
      });
  },
});

export const selectEmployee = (state: RootState) => state.employee.employee;
export const selectEmployees = (state: RootState) => state.employee.employees;

export const { setEmployeesPagination } = employeeSlice.actions;

export default employeeSlice.reducer;
