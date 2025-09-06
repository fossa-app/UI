import { createSlice, PayloadAction, createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import {
  Branch,
  BranchDTO,
  Department,
  DepartmentDTO,
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
  getEmployeesAssignedDepartmentIds,
  getEmployeesManagerIds,
} from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchBranchById, fetchBranchesByIds } from './branchSlice';
import { fetchDepartmentById, fetchDepartmentsByIds } from './departmentSlice';

interface EmployeeState {
  employees: StateEntity<PaginatedResponse<Employee> | undefined>;
  managers: StateEntity<PaginatedResponse<EmployeeDTO> | undefined>;
  employee: StateEntity<Employee | undefined>;
}

const initialState: EmployeeState = {
  employees: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
  managers: {
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

const fetchManager = async (dispatch: ThunkDispatch<unknown, unknown, UnknownAction>, id: string) => {
  return dispatch(
    fetchEmployeeById({
      id,
      skipState: true,
      shouldFetchBranch: false,
      shouldFetchDepartment: false,
      shouldFetchEmployeeManager: false,
      shouldFetchBranchGeoAddress: false,
    })
  ).unwrap();
};

export const fetchEmployees = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  { pagination: Partial<PaginationParams>; shouldFetchBranches?: boolean; shouldFetchDepartments?: boolean; shouldFetchManagers?: boolean },
  { rejectValue: ErrorResponseDTO }
>(
  'employee/fetchEmployees',
  async (
    { pagination: { pageNumber, pageSize, search }, shouldFetchBranches = true, shouldFetchDepartments = true, shouldFetchManagers = true },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
      const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

      if (data) {
        const assignedBranchIds = getEmployeesAssignedBranchIds(data.items);
        const assignedDepartmentIds = getEmployeesAssignedDepartmentIds(data.items);
        const managerIds = getEmployeesManagerIds(data.items);
        let branches: PaginatedResponse<BranchDTO> | undefined;
        let departments: PaginatedResponse<DepartmentDTO> | undefined;
        let managers: PaginatedResponse<EmployeeDTO> | undefined;

        if (shouldFetchBranches && assignedBranchIds.length) {
          branches = await dispatch(fetchBranchesByIds(assignedBranchIds)).unwrap();
        }

        if (shouldFetchDepartments && assignedDepartmentIds.length) {
          departments = await dispatch(fetchDepartmentsByIds(assignedDepartmentIds)).unwrap();
        }

        if (shouldFetchManagers && managerIds.length) {
          managers = await dispatch(fetchEmployeesByIds(managerIds)).unwrap();
        }

        return {
          ...data,
          items: mapEmployees({
            employees: data.items,
            branches: branches?.items,
            departments: departments?.items,
            managers: managers?.items,
          }),
        };
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const fetchManagers = createAsyncThunk<
  PaginatedResponse<EmployeeDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('employee/fetchManagers', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const fetchEmployeesTotal = createAsyncThunk<PaginatedResponse<EmployeeDTO> | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'employee/fetchEmployeesTotal',
  async (_, { rejectWithValue }) => {
    try {
      const queryParams = prepareQueryParams({ pageNumber: 1, pageSize: 1 });
      const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

      return data;
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const fetchEmployeeById = createAsyncThunk<
  Employee,
  {
    id: string;
    skipState?: boolean;
    shouldFetchBranch?: boolean;
    shouldFetchBranchGeoAddress?: boolean;
    shouldFetchDepartment?: boolean;
    shouldFetchEmployeeManager?: boolean;
  },
  { rejectValue: ErrorResponseDTO }
>(
  'employee/fetchEmployeeById',
  async (
    { id, shouldFetchBranch = true, shouldFetchBranchGeoAddress = true, shouldFetchDepartment = true, shouldFetchEmployeeManager = true },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get<EmployeeDTO>(`${ENDPOINTS.employees}/${id}`);
      let branch: Branch | undefined;
      let department: Department | undefined;
      let manager: Employee | undefined;

      if (data.assignedBranchId && shouldFetchBranch) {
        branch = await dispatch(
          fetchBranchById({ id: String(data.assignedBranchId), skipState: true, shouldFetchBranchGeoAddress })
        ).unwrap();
      }

      if (data.assignedDepartmentId && shouldFetchDepartment) {
        department = await dispatch(fetchDepartmentById({ id: String(data.assignedDepartmentId), skipState: true })).unwrap();
      }

      if (data.reportsToId && shouldFetchEmployeeManager) {
        manager = (await fetchManager(dispatch, String(data.reportsToId))) as Employee;
      }

      return mapEmployee({ branch, department, manager, employee: data, user: undefined });
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

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
    updateEmployeesPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.employees.page = { ...state.employees.page, ...action.payload };
    },
    resetEmployeesPagination(state) {
      state.employees.page = initialState.employees.page;
    },
    updateManagersPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.managers.page = { ...state.managers.page, ...action.payload };
    },
    resetEmployeesFetchStatus(state) {
      state.employees.fetchStatus = initialState.employees.fetchStatus;
    },
    resetManagersFetchStatus(state) {
      state.managers.fetchStatus = initialState.managers.fetchStatus;
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
      .addCase(fetchManagers.pending, (state) => {
        state.managers.fetchStatus = 'loading';
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.managers.page!.totalItems = action.payload?.totalItems;
        state.managers.page!.totalPages = action.payload?.totalPages;
        state.managers.page!.pageNumber = action.payload?.pageNumber;
        state.managers.fetchStatus = 'succeeded';

        const existingItems = state.managers.data?.items || [];
        const newItems = action.payload?.items.filter((item) => !existingItems.some(({ id }) => id === item.id)) || [];

        state.managers.data = {
          ...action.payload,
          items: [...existingItems, ...newItems],
        };
      })
      .addCase(fetchManagers.rejected, (state) => {
        state.managers.fetchStatus = 'failed';
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
        state.employee.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.employee.updateStatus = 'succeeded';
        state.employee.updateError = undefined;
      });
  },
});

export const selectEmployees = (state: RootState) => state.employee.employees;
export const selectManagers = (state: RootState) => state.employee.managers;
export const selectEmployee = (state: RootState) => state.employee.employee;

export const {
  updateEmployeesPagination,
  resetEmployeesPagination,
  updateManagersPagination,
  resetEmployeesFetchStatus,
  resetManagersFetchStatus,
  resetEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
