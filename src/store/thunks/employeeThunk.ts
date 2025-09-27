import { createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchById, fetchBranchesByIds, fetchDepartmentById, fetchDepartmentsByIds } from 'store/thunks';
import { resetOrgChartEmployeesFetchStatus, setError, setSuccess } from 'store/features';
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
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import {
  mapEmployee,
  mapEmployees,
  prepareQueryParams,
  mapError,
  prepareCommaSeparatedQueryParamsByKey,
  getEntityIdsByField,
} from 'shared/helpers';

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
  Partial<PaginationParams> & {
    shouldFetchBranches?: boolean;
    shouldFetchDepartments?: boolean;
    shouldFetchManagers?: boolean;
  },
  { rejectValue: ErrorResponseDTO }
>(
  'employee/fetchEmployees',
  async (
    { pageNumber, pageSize, search, shouldFetchBranches = true, shouldFetchDepartments = true, shouldFetchManagers = true },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const queryParams = prepareQueryParams({ pageNumber, pageSize, search });
      const { data } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${queryParams}`);

      if (data) {
        const assignedBranchIds = getEntityIdsByField(data.items, 'assignedBranchId');
        const assignedDepartmentIds = getEntityIdsByField(data.items, 'assignedDepartmentId');
        const managerIds = getEntityIdsByField(data.items, 'reportsToId');
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

export const fetchOrgChartEmployees = createAsyncThunk<
  PaginatedResponse<EmployeeDTO> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ErrorResponseDTO }
>('employee/fetchOrgChartEmployees', async ({ pageNumber, pageSize }, { rejectWithValue }) => {
  try {
    const fetchSubordinates = async (reportsTo?: EmployeeDTO): Promise<EmployeeDTO[]> => {
      const queryParams = { pageNumber, pageSize, reportsToId: reportsTo?.id, topLevelOnly: !reportsTo };
      const subordinatesQuery = prepareQueryParams(queryParams);
      const { data: subordinateData } = await axios.get<PaginatedResponse<EmployeeDTO>>(`${ENDPOINTS.employees}?${subordinatesQuery}`);

      return subordinateData.items.concat((await Promise.all(subordinateData.items.map(fetchSubordinates))).flat());
    };

    return {
      items: await fetchSubordinates(),
    };
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

    dispatch(resetOrgChartEmployeesFetchStatus());
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
