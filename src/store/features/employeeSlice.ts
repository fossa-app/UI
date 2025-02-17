import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import { AppUser, Employee, EmployeeDTO, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapEmployee, mapEmployees, mapUserProfileToEmployee, prepareQueryParams } from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchUser } from './authSlice';

interface SetupState {
  employee: StateEntity<Employee | undefined>;
  employees: StateEntity<PaginatedResponse<Employee> | undefined>;
  otherEmployee: StateEntity<Employee | undefined>;
}

const initialState: SetupState = {
  // TODO: rename to profile maybe, it's confusing
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
  otherEmployee: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
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
>('employee/getEmployees', async ({ pageNumber, pageSize, search }, { getState, rejectWithValue }) => {
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
  'employee/getEmployeeById',
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

export const createEmployee = createAsyncThunk<void, EmployeeDTO, { state: RootState; rejectValue: ErrorResponse }>(
  'employee/setEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.employee, employee);
      await dispatch(fetchEmployee()).unwrap();

      dispatch(setSuccess(MESSAGES.success.employee.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.employee.create,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

// TODO: rename to editProfile
export const editEmployee = createAsyncThunk<void, Omit<EmployeeDTO, 'id'>, { rejectValue: ErrorResponse }>(
  'employee/editEmployee',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(ENDPOINTS.employee, employee);

      dispatch(setSuccess(MESSAGES.success.employee.updateProfile));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponse),
          title: MESSAGES.error.employee.updateProfile,
        })
      );

      return rejectWithValue(error as ErrorResponse);
    }
  }
);

export const editOtherEmployee = createAsyncThunk<void, [string, Pick<EmployeeDTO, 'assignedBranchId'>], { rejectValue: ErrorResponse }>(
  'employee/editOtherEmployee',
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
    resetEmployeesFetchStatus(state) {
      state.employees.fetchStatus = initialState.employees.fetchStatus;
    },
    resetEmployeeFetchStatus(state) {
      state.employee.fetchStatus = initialState.employee.fetchStatus;
    },
    resetOtherEmployee(state) {
      state.otherEmployee = initialState.otherEmployee;
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
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.otherEmployee.fetchStatus = 'loading';
      })
      .addCase(fetchEmployeeById.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.otherEmployee.fetchStatus = 'failed';
        state.otherEmployee.error = action.payload;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action: PayloadAction<Employee | undefined>) => {
        state.otherEmployee.data = action.payload;
        state.otherEmployee.fetchStatus = 'succeeded';
      })
      .addCase(editOtherEmployee.pending, (state) => {
        state.otherEmployee.updateStatus = 'loading';
      })
      .addCase(editOtherEmployee.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.otherEmployee.updateStatus = 'failed';
        state.otherEmployee.error = action.payload;
      })
      .addCase(editOtherEmployee.fulfilled, (state) => {
        state.otherEmployee.updateStatus = 'succeeded';
      });
  },
});

export const selectEmployee = (state: RootState) => state.employee.employee;
export const selectEmployees = (state: RootState) => state.employee.employees;
export const selectOtherEmployee = (state: RootState) => state.employee.otherEmployee;

export const { setEmployeesPagination, resetEmployeesFetchStatus, resetEmployeeFetchStatus, resetOtherEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
