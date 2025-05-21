import { createSlice, PayloadAction, createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { RootState, StateEntity } from 'store';
import axios from 'shared/configs/axios';
import {
  ErrorResponseDTO,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  Department,
  DepartmentDTO,
  EmployeeDTO,
} from 'shared/models';
import { APP_CONFIG, MESSAGES, ENDPOINTS } from 'shared/constants';
import {
  prepareQueryParams,
  mapDepartments,
  mapError,
  mapDepartment,
  getDepartmentsManagerIds,
  prepareCommaSeparatedQueryParamsByKey,
  getParentDepartmentsIds,
} from 'shared/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchEmployeeById, fetchEmployeesByIds } from './employeeSlice';

interface DepartmentState {
  department: StateEntity<Department | undefined>;
  departments: StateEntity<PaginatedResponse<Department> | undefined>;
  searchedDepartments: StateEntity<PaginatedResponse<Department> | undefined>;
  parentDepartments: StateEntity<PaginatedResponse<DepartmentDTO> | undefined>;
}

const initialState: DepartmentState = {
  department: {
    data: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  departments: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
  searchedDepartments: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
  parentDepartments: {
    data: undefined,
    page: APP_CONFIG.table.defaultPagination,
    fetchStatus: 'idle',
  },
};

const fetchDepartmentRecursive = async (
  id: string,
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
  isDepartmentManager = true
): Promise<Department> => {
  const { data } = await axios.get<DepartmentDTO>(`${ENDPOINTS.departments}/${id}`);
  let parentDepartment: Department | undefined;
  let employee: EmployeeDTO | undefined;

  if (isDepartmentManager && data.managerId) {
    employee = await dispatch(
      fetchEmployeeById({
        id: String(data.managerId),
        skipState: true,
        shouldFetchBranch: false,
      })
    ).unwrap();
  }

  if (data.parentDepartmentId) {
    parentDepartment = await fetchDepartmentRecursive(String(data.parentDepartmentId), dispatch, false);
  }

  return mapDepartment(data, parentDepartment, employee);
};

export const fetchDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  [Partial<PaginationParams>, boolean?],
  { rejectValue: ErrorResponseDTO }
>('department/fetchDepartments', async ([{ pageNumber, pageSize, search }, shouldFetchEmployees = true], { dispatch, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    if (data) {
      const departmentsManagerIds = getDepartmentsManagerIds(data.items);
      const parentDepartmentsIds = getParentDepartmentsIds(data.items);
      let employees: PaginatedResponse<EmployeeDTO> | undefined;
      let parentDepartments: PaginatedResponse<DepartmentDTO> | undefined;

      if (shouldFetchEmployees && departmentsManagerIds.length) {
        employees = await dispatch(fetchEmployeesByIds(departmentsManagerIds)).unwrap();
      }

      if (parentDepartmentsIds.length) {
        parentDepartments = await dispatch(fetchDepartmentsByIds(parentDepartmentsIds)).unwrap();
      }

      return {
        ...data,
        items: mapDepartments(data.items, parentDepartments?.items, employees?.items),
      };
    }
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchSearchedDepartments = createAsyncThunk<
  PaginatedResponse<DepartmentDTO> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ErrorResponseDTO }
>('department/fetchSearchedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchParentDepartments = createAsyncThunk<
  PaginatedResponse<DepartmentDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('department/fetchParentDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchDepartmentsByIds = createAsyncThunk<
  PaginatedResponse<DepartmentDTO> | undefined,
  number[],
  { rejectValue: ErrorResponseDTO }
>('department/fetchDepartmentsByIds', async (ids, { rejectWithValue }) => {
  try {
    const queryParams = prepareCommaSeparatedQueryParamsByKey('id', ids);
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchDepartmentById = createAsyncThunk<Department, { id: string; skipState?: boolean }, { rejectValue: ErrorResponseDTO }>(
  'department/fetchDepartmentById',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      return await fetchDepartmentRecursive(id, dispatch, true);
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const createDepartment = createAsyncThunk<void, DepartmentDTO, { rejectValue: ErrorResponse<FieldValues> }>(
  'department/createDepartment',
  async (department, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.departments, department);

      dispatch(setSuccess(MESSAGES.success.departments.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.departments.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editDepartment = createAsyncThunk<void, [string, Omit<DepartmentDTO, 'id'>], { rejectValue: ErrorResponse<FieldValues> }>(
  'department/editDepartment',
  async ([id, department], { dispatch, rejectWithValue }) => {
    try {
      await axios.put<void>(`${ENDPOINTS.departments}/${id}`, department);

      dispatch(setSuccess(MESSAGES.success.departments.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.departments.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteDepartment = createAsyncThunk<void, DepartmentDTO['id'], { state: RootState; rejectValue: ErrorResponseDTO }>(
  'department/deleteDepartment',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(`${ENDPOINTS.departments}/${id}`);

      dispatch(resetDepartmentsFetchStatus());
      dispatch(setSuccess(MESSAGES.success.departments.delete));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.departments.delete,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    updateDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.departments.page = { ...state.departments.page, ...action.payload };
    },
    resetDepartmentsPagination(state) {
      state.departments.page = initialState.departments.page;
    },
    updateParentDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.parentDepartments.page = { ...state.parentDepartments.page, ...action.payload };
    },
    resetDepartmentsFetchStatus(state) {
      state.departments.fetchStatus = initialState.departments.fetchStatus;
    },
    resetParentDepartmentsFetchStatus(state) {
      state.parentDepartments.fetchStatus = initialState.parentDepartments.fetchStatus;
    },
    resetDepartment(state) {
      state.department = initialState.department as WritableDraft<StateEntity<Department>>;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.departments.fetchStatus = 'loading';
      })
      .addCase(fetchDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.departments.data = undefined;
        state.departments.fetchStatus = 'failed';
        state.departments.error = action.payload;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        state.departments.data = action.payload;
        state.departments.page!.totalItems = action.payload?.totalItems;
        state.departments.page!.totalPages = action.payload?.totalPages;
        state.departments.fetchStatus = 'succeeded';
        state.departments.error = undefined;
      })
      .addCase(fetchSearchedDepartments.pending, (state) => {
        state.searchedDepartments.fetchStatus = 'loading';
      })
      .addCase(fetchSearchedDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.searchedDepartments.data = undefined;
        state.searchedDepartments.fetchStatus = 'failed';
        state.searchedDepartments.error = action.payload;
      })
      .addCase(fetchSearchedDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        state.searchedDepartments.data = action.payload;
        state.searchedDepartments.page!.totalItems = action.payload?.totalItems;
        state.searchedDepartments.page!.totalPages = action.payload?.totalPages;
        state.searchedDepartments.fetchStatus = 'succeeded';
        state.searchedDepartments.error = undefined;
      })
      .addCase(fetchParentDepartments.pending, (state) => {
        state.parentDepartments.fetchStatus = 'loading';
      })
      .addCase(fetchParentDepartments.fulfilled, (state, action) => {
        state.parentDepartments.page!.totalItems = action.payload?.totalItems;
        state.parentDepartments.page!.totalPages = action.payload?.totalPages;
        state.parentDepartments.page!.pageNumber = action.payload?.pageNumber;
        state.parentDepartments.fetchStatus = 'succeeded';

        const existingItems = state.parentDepartments.data?.items || [];
        const newItems = action.payload?.items.filter((item) => !existingItems.some(({ id }) => id === item.id)) || [];

        state.parentDepartments.data = {
          ...action.payload,
          items: [...existingItems, ...newItems],
        };
      })
      .addCase(fetchParentDepartments.rejected, (state) => {
        state.parentDepartments.fetchStatus = 'failed';
      })
      .addCase(fetchDepartmentById.pending, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.fetchStatus = 'loading';
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.data = undefined;
        state.department.fetchStatus = 'failed';
        state.department.error = action.payload;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.data = action.payload;
        state.department.fetchStatus = 'succeeded';
        state.department.error = undefined;
      })
      .addCase(createDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(createDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.error = undefined;
      })
      .addCase(editDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(editDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.error = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.error = undefined;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.department.deleteStatus = 'loading';
      })
      .addCase(deleteDepartment.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.department.deleteStatus = 'failed';
        state.department.error = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state) => {
        state.department.deleteStatus = 'succeeded';
        state.department.error = undefined;
      });
  },
});

export const selectDepartment = (state: RootState) => state.department.department;
export const selectDepartments = (state: RootState) => state.department.departments;
export const selectSearchedDepartments = (state: RootState) => state.department.searchedDepartments;
export const selectParentDepartments = (state: RootState) => state.department.parentDepartments;

export const {
  updateDepartmentsPagination,
  resetDepartmentsPagination,
  updateParentDepartmentsPagination,
  resetDepartmentsFetchStatus,
  resetParentDepartmentsFetchStatus,
  resetDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
