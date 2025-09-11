import { createSlice, PayloadAction, createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { WritableDraft } from 'immer';
import { PaginatedStateEntity, RootState, StateEntityNew } from 'store';
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
import { mergePaginatedItems } from 'store/helpers';
import { setError, setSuccess } from './messageSlice';
import { fetchEmployeeById, fetchEmployeesByIds } from './employeeSlice';

interface DepartmentState {
  department: StateEntityNew<Department>;
  departmentCatalog: PaginatedStateEntity<Department>;
  searchedDepartments: PaginatedStateEntity<Department>;
  parentDepartments: PaginatedStateEntity<DepartmentDTO>;
  assignedDepartments: PaginatedStateEntity<DepartmentDTO>;
}

const initialState: DepartmentState = {
  department: {
    item: undefined,
    fetchStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  departmentCatalog: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  searchedDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  parentDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
  assignedDepartments: {
    items: [],
    page: APP_CONFIG.table.defaultPagination,
    status: 'idle',
  },
};

const fetchParentDepartment = async (dispatch: ThunkDispatch<unknown, unknown, UnknownAction>, id: string) => {
  return dispatch(
    fetchDepartmentById({
      id,
      skipState: true,
      shouldFetchParent: false,
      shouldFetchDepartmentManager: false,
    })
  ).unwrap();
};

export const fetchDepartmentsTotal = createAsyncThunk<
  PaginatedResponse<DepartmentDTO> | undefined,
  void,
  { rejectValue: ErrorResponseDTO }
>('department/fetchDepartmentsTotal', async (_, { rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber: 1, pageSize: 1 });
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ErrorResponseDTO),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

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

export const fetchAssignedDepartments = createAsyncThunk<
  PaginatedResponse<DepartmentDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('department/fetchAssignedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
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

export const fetchDepartmentById = createAsyncThunk<
  Department,
  {
    id: string;
    skipState?: boolean;
    shouldFetchParent?: boolean;
    shouldFetchDepartmentManager?: boolean;
  },
  { rejectValue: ErrorResponseDTO }
>(
  'department/fetchDepartmentById',
  async ({ id, shouldFetchParent = true, shouldFetchDepartmentManager = true }, { dispatch, rejectWithValue }): Promise<Department> => {
    try {
      const { data } = await axios.get<DepartmentDTO>(`${ENDPOINTS.departments}/${id}`);

      let parentDepartment: Department | undefined;
      let manager: EmployeeDTO | undefined;

      if (data.parentDepartmentId && shouldFetchParent) {
        parentDepartment = await fetchParentDepartment(dispatch, String(data.parentDepartmentId));
      }

      if (data.managerId && shouldFetchDepartmentManager) {
        manager = await dispatch(
          fetchEmployeeById({
            id: String(data.managerId),
            skipState: true,
            shouldFetchBranch: false,
            shouldFetchDepartment: false,
            shouldFetchEmployeeManager: false,
          })
        ).unwrap();
      }

      return mapDepartment(data, parentDepartment, manager);
    } catch (error) {
      return rejectWithValue(error as ErrorResponseDTO) as unknown as Department;
    }
  }
);

export const createDepartment = createAsyncThunk<void, DepartmentDTO, { rejectValue: ErrorResponse<FieldValues> }>(
  'department/createDepartment',
  async (department, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<void>(ENDPOINTS.departments, department);

      dispatch(resetParentDepartments());

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

      dispatch(resetParentDepartments());

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
      dispatch(resetParentDepartments());
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
      state.departmentCatalog.page = { ...state.departmentCatalog.page, ...action.payload };
    },
    resetDepartmentsPagination(state) {
      state.departmentCatalog.page = initialState.departmentCatalog.page;
    },
    updateParentDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.parentDepartments.page = { ...state.parentDepartments.page, ...action.payload };
    },
    updateAssignedDepartmentsPagination(state, action: PayloadAction<Partial<PaginationParams>>) {
      state.assignedDepartments.page = { ...state.assignedDepartments.page, ...action.payload };
    },
    resetDepartmentsFetchStatus(state) {
      state.departmentCatalog.status = initialState.departmentCatalog.status;
    },
    resetParentDepartmentsFetchStatus(state) {
      state.parentDepartments.status = initialState.parentDepartments.status;
    },
    resetParentDepartments(state) {
      state.parentDepartments.status = initialState.parentDepartments.status;
      state.parentDepartments.items = initialState.parentDepartments.items;
    },
    resetAssignedDepartmentsFetchStatus(state) {
      state.assignedDepartments.status = initialState.assignedDepartments.status;
    },
    resetDepartment(state) {
      state.department = initialState.department as WritableDraft<StateEntityNew<Department>>;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentCatalog.status = 'loading';
      })
      .addCase(fetchDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.departmentCatalog.items = [];
        state.departmentCatalog.status = 'failed';
        state.departmentCatalog.error = action.payload;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.departmentCatalog.items = items;
        state.departmentCatalog.page = page;
        state.departmentCatalog.status = 'succeeded';
        state.departmentCatalog.error = undefined;
      })
      .addCase(fetchSearchedDepartments.pending, (state) => {
        state.searchedDepartments.status = 'loading';
      })
      .addCase(fetchSearchedDepartments.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.searchedDepartments.items = [];
        state.searchedDepartments.status = 'failed';
        state.searchedDepartments.error = action.payload;
      })
      .addCase(fetchSearchedDepartments.fulfilled, (state, action: PayloadAction<PaginatedResponse<Department> | undefined>) => {
        const { items = [], ...page } = action.payload || {};

        state.searchedDepartments.items = items;
        state.searchedDepartments.page = page;
        state.searchedDepartments.status = 'succeeded';
        state.searchedDepartments.error = undefined;
      })
      .addCase(fetchParentDepartments.pending, (state) => {
        state.parentDepartments.status = 'loading';
      })
      .addCase(fetchParentDepartments.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.parentDepartments.items = mergePaginatedItems<DepartmentDTO>(state.parentDepartments.items, items);
        state.parentDepartments.page = page;
        state.parentDepartments.status = 'succeeded';
      })
      .addCase(fetchParentDepartments.rejected, (state) => {
        state.parentDepartments.status = 'failed';
      })
      .addCase(fetchAssignedDepartments.pending, (state) => {
        state.assignedDepartments.status = 'loading';
      })
      .addCase(fetchAssignedDepartments.fulfilled, (state, action) => {
        const { items = [], ...page } = action.payload || {};

        state.assignedDepartments.items = mergePaginatedItems<DepartmentDTO>(state.assignedDepartments.items, items);
        state.assignedDepartments.page = page;
        state.assignedDepartments.status = 'succeeded';
      })
      .addCase(fetchAssignedDepartments.rejected, (state) => {
        state.assignedDepartments.status = 'failed';
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

        state.department.item = undefined;
        state.department.fetchStatus = 'failed';
        state.department.fetchError = action.payload;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        if (action.meta.arg.skipState) {
          return;
        }

        state.department.item = action.payload;
        state.department.fetchStatus = 'succeeded';
        state.department.fetchError = undefined;
      })
      .addCase(createDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(createDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.updateError = undefined;
      })
      .addCase(editDepartment.pending, (state) => {
        state.department.updateStatus = 'loading';
      })
      .addCase(editDepartment.rejected, (state, action: PayloadAction<ErrorResponse<FieldValues> | undefined>) => {
        state.department.updateStatus = 'failed';
        state.department.updateError = action.payload as WritableDraft<ErrorResponse<FieldValues>>;
      })
      .addCase(editDepartment.fulfilled, (state) => {
        state.department.updateStatus = 'succeeded';
        state.department.updateError = undefined;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.department.deleteStatus = 'loading';
      })
      .addCase(deleteDepartment.rejected, (state, action: PayloadAction<ErrorResponseDTO | undefined>) => {
        state.department.deleteStatus = 'failed';
        state.department.deleteError = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state) => {
        state.department.deleteStatus = 'succeeded';
        state.department.deleteError = undefined;
      });
  },
});

export const selectDepartment = (state: RootState) => state.department.department;
export const selectDepartmentCatalog = (state: RootState) => state.department.departmentCatalog;
export const selectSearchedDepartments = (state: RootState) => state.department.searchedDepartments;
export const selectParentDepartments = (state: RootState) => state.department.parentDepartments;
export const selectAssignedDepartments = (state: RootState) => state.department.assignedDepartments;

export const {
  updateDepartmentsPagination,
  resetDepartmentsPagination,
  updateParentDepartmentsPagination,
  resetDepartmentsFetchStatus,
  resetParentDepartments,
  resetParentDepartmentsFetchStatus,
  updateAssignedDepartmentsPagination,
  resetAssignedDepartmentsFetchStatus,
  resetDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
