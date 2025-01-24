import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { AppUser, Employee, EmployeeDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapEmployee, mapEmployees, mapUserProfileToEmployee, prepareQueryParams } from 'shared/helpers';
import { setError } from './errorSlice';
import { fetchUser } from './authSlice';

interface SetupState {
  employee: StateEntity<Employee | undefined>;
  employees: StateEntity<PaginatedResponse<Employee> | undefined>;
}

const initialState: SetupState = {
  employee: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
  },
  employees: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

export const fetchEmployee = createAsyncThunk<Employee | undefined, void, { rejectValue: ErrorResponse }>(
  'employee/getEmployee',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<EmployeeDTO>(ENDPOINTS.employee);

      if (data) {
        const state = getState() as RootState;
        const user = state.auth.user.data;

        return mapEmployee(data, user);
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponse),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const fetchEmployees = createAsyncThunk<
  PaginatedResponse<EmployeeDTO> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponse }
>('employee/getEmployees', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

    if (data) {
      return {
        ...data,
        items: mapEmployees(data.items),
      };
    }
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponse),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const createEmployee = createAsyncThunk<void, EmployeeDTO, { state: RootState; rejectValue: ErrorResponse }>(
  'employee/setEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.employee, employee);
      await dispatch(fetchEmployee()).unwrap();
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.employee.createFailed,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const editEmployee = createAsyncThunk<void, Omit<EmployeeDTO, 'id'>, { rejectValue: ErrorResponse }>(
  'employee/editEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<EmployeeDTO>(ENDPOINTS.employee, employee);
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.employee.updateFailed,
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
    resetEmployeesFetchStatus(state) {
      state.employees.fetchStatus = initialState.employees.fetchStatus;
    },
    resetEmployeeFetchStatus(state) {
      state.employee.fetchStatus = initialState.employee.fetchStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployee.pending, (state) => {
        state.employee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.fetchStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee | undefined>) => {
        state.employee.data = action.payload;
        state.employee.data!.isDraft = false;
        state.employee.fetchStatus = 'succeeded';
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<AppUser | undefined>) => {
        state.employee.data = mapUserProfileToEmployee(action.payload?.profile);
        state.employee.data!.isDraft = true;
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
      .addCase(editEmployee.pending, (state) => {
        state.employee.updateStatus = 'loading';
      })
      .addCase(editEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.employee.updateStatus = 'failed';
        state.employee.error = action.payload;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
      })
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
      });
  },
});

export const selectEmployee = (state: RootState) => state.employee.employee;
export const selectEmployees = (state: RootState) => state.employee.employees;

export const { setEmployeesPagination, resetEmployeesFetchStatus, resetEmployeeFetchStatus } = employeeSlice.actions;

export default employeeSlice.reducer;
