import { createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import {
  setError,
  setSuccess,
  resetCompanyDatasourceTotalsFetchStatus,
  resetParentDepartments,
  resetDepartmentsFetchStatus,
} from 'store/features';
import { fetchEmployeeById, fetchEmployeesByIds } from 'store/thunks';
import axios from 'shared/configs/axios';
import {
  ErrorResponseDTO,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  Department,
  DepartmentDTO,
  EmployeeDTO,
  EntityInput,
} from 'shared/types';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import {
  prepareQueryParams,
  mapDepartments,
  mapError,
  mapDepartment,
  prepareCommaSeparatedQueryParamsByKey,
  getEntityIdsByField,
} from 'shared/helpers';

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
  Partial<PaginationParams> & { shouldFetchEmployees?: boolean },
  { rejectValue: ErrorResponseDTO }
>('department/fetchDepartments', async ({ pageNumber, pageSize, search, shouldFetchEmployees = true }, { dispatch, rejectWithValue }) => {
  try {
    const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
    const { data } = await axios.get<PaginatedResponse<DepartmentDTO>>(`${ENDPOINTS.departments}?${queryParams}`);

    if (data) {
      const departmentsManagerIds = getEntityIdsByField(data.items, 'managerId');
      const parentDepartmentsIds = getEntityIdsByField(data.items, 'parentDepartmentId');
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

export const createDepartment = createAsyncThunk<void, EntityInput<DepartmentDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
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

export const editDepartment = createAsyncThunk<void, [string, EntityInput<DepartmentDTO>], { rejectValue: ErrorResponse<FieldValues> }>(
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
      dispatch(resetCompanyDatasourceTotalsFetchStatus());
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
