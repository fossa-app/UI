import { createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchById, fetchBranchesByIds, fetchDepartmentById, fetchDepartmentsByIds } from 'store/thunks';
import { resetOrgChartEmployeesFetchStatus, setError, setSuccess } from 'store/features';
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
} from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { EmployeeQueryRequestModel, EmployeeManagementModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapEmployee, mapEmployees, mapError, getEntityIdsByField } from 'shared/helpers';

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
      const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
      const data = (await employeeClient.GetEmployeesAsync(
        query,
        new AbortController().signal
      )) as unknown as PaginatedResponse<EmployeeDTO>;

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
    const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
    const data = (await employeeClient.GetEmployeesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<EmployeeDTO>;

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
      const query = new EmployeeQueryRequestModel(
        [],
        '',
        pageNumber || null,
        pageSize || null,
        reportsTo?.id ? BigInt(reportsTo.id) : null,
        !reportsTo
      );
      const subordinateData = (await employeeClient.GetEmployeesAsync(
        query,
        new AbortController().signal
      )) as unknown as PaginatedResponse<EmployeeDTO>;

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
      const query = new EmployeeQueryRequestModel([], '', 1, 1, null, null);
      const data = (await employeeClient.GetEmployeesAsync(
        query,
        new AbortController().signal
      )) as unknown as PaginatedResponse<EmployeeDTO>;

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
      const data = (await employeeClient.GetEmployeeAsync(BigInt(id), new AbortController().signal)) as unknown as EmployeeDTO;
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
    let idList: bigint[] = [];
    try {
      idList = ids.map((id) => BigInt(id));
    } catch {
      // Ignored
    }

    const query = new EmployeeQueryRequestModel(idList, '', null, null, null, null);
    const data = (await employeeClient.GetEmployeesAsync(query, new AbortController().signal)) as unknown as PaginatedResponse<EmployeeDTO>;

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
    const curEmp = (await employeeClient.GetEmployeeAsync(BigInt(id), new AbortController().signal)) as unknown as EmployeeDTO;

    const modModel = new EmployeeManagementModel(
      employee.assignedBranchId ? BigInt(employee.assignedBranchId) : null,
      curEmp.assignedDepartmentId ? BigInt(curEmp.assignedDepartmentId) : null,
      curEmp.reportsToId ? BigInt(curEmp.reportsToId) : null,
      curEmp.jobTitle || ''
    );
    await employeeClient.ManageEmployeeAsync(BigInt(id), modModel, new AbortController().signal);

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
