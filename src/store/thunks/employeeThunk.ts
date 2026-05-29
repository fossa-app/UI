import { createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchById, fetchBranchesByIds, fetchDepartmentById, fetchDepartmentsByIds } from 'store/thunks';
import { resetOrgChartEmployeesFetchStatus, setError, setSuccess } from 'store/features';
import { Branch, Department, Employee, ErrorResponse, ValidationProblemDetails, PaginatedResponse, PaginationParams } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { unwrapBridgePagingResponse, unwrapBridgeUnitResult, unwrapBridgeValue } from 'shared/configs/BridgeResponses';
import { EmployeeQueryRequestModel, EmployeeManagementModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapEmployee, mapEmployees, mapError, getEntityIdsByField } from 'shared/helpers';

const nullableBigInt = (value: number | null | undefined): bigint | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return BigInt(value);
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
  Partial<PaginationParams> & {
    shouldFetchBranches?: boolean;
    shouldFetchDepartments?: boolean;
    shouldFetchManagers?: boolean;
  },
  { rejectValue: ValidationProblemDetails }
>(
  'employee/fetchEmployees',
  async (
    { pageNumber, pageSize, search, shouldFetchBranches = true, shouldFetchDepartments = true, shouldFetchManagers = true },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
      const data = unwrapBridgePagingResponse<Employee>(await employeeClient.GetEmployeesAsync(query, new AbortController().signal));

      if (data) {
        const assignedBranchIds = getEntityIdsByField(data.items, 'assignedBranchId');
        const assignedDepartmentIds = getEntityIdsByField(data.items, 'assignedDepartmentId');
        const managerIds = getEntityIdsByField(data.items, 'reportsToId');
        let branches: PaginatedResponse<Branch> | undefined;
        let departments: PaginatedResponse<Department> | undefined;
        let managers: PaginatedResponse<Employee> | undefined;

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
        ...(error as ValidationProblemDetails),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const fetchManagers = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ValidationProblemDetails }
>('employee/fetchManagers', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
    const data = unwrapBridgePagingResponse<Employee>(await employeeClient.GetEmployeesAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const fetchOrgChartEmployees = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ValidationProblemDetails }
>('employee/fetchOrgChartEmployees', async ({ pageNumber, pageSize }, { rejectWithValue }) => {
  try {
    const fetchSubordinates = async (reportsTo?: Employee): Promise<Employee[]> => {
      const query = new EmployeeQueryRequestModel(
        [],
        '',
        pageNumber || null,
        pageSize || null,
        reportsTo?.id ? BigInt(reportsTo.id) : null,
        !reportsTo
      );
      const subordinateData = unwrapBridgePagingResponse<Employee>(
        await employeeClient.GetEmployeesAsync(query, new AbortController().signal)
      );

      return subordinateData.items.concat((await Promise.all(subordinateData.items.map(fetchSubordinates))).flat());
    };

    return {
      items: await fetchSubordinates(),
    };
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const fetchEmployeesTotal = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  void,
  { rejectValue: ValidationProblemDetails }
>('employee/fetchEmployeesTotal', async (_, { rejectWithValue }) => {
  try {
    const query = new EmployeeQueryRequestModel([], '', 1, 1, null, null);
    const data = unwrapBridgePagingResponse<Employee>(await employeeClient.GetEmployeesAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

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
  { rejectValue: ValidationProblemDetails }
>(
  'employee/fetchEmployeeById',
  async (
    { id, shouldFetchBranch = true, shouldFetchBranchGeoAddress = true, shouldFetchDepartment = true, shouldFetchEmployeeManager = true },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = unwrapBridgeValue<Employee>(await employeeClient.GetEmployeeAsync(BigInt(id), new AbortController().signal));
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
      return rejectWithValue(error as ValidationProblemDetails);
    }
  }
);

export const fetchEmployeesByIds = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  number[],
  { rejectValue: ValidationProblemDetails }
>('employee/fetchEmployeesByIds', async (ids, { rejectWithValue }) => {
  try {
    let idList: bigint[] = [];
    try {
      idList = ids.map((id) => BigInt(id));
    } catch {
      // Ignored
    }

    const query = new EmployeeQueryRequestModel(idList, '', null, null, null, null);
    const data = unwrapBridgePagingResponse<Employee>(await employeeClient.GetEmployeesAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.employee.notFound,
    });
  }
});

export const editEmployee = createAsyncThunk<
  void,
  [string, Pick<Employee, 'assignedBranchId'>],
  { rejectValue: ErrorResponse<FieldValues> }
>('employee/editEmployee', async ([id, employee], { dispatch, rejectWithValue }) => {
  try {
    const curEmp = unwrapBridgeValue<Employee>(await employeeClient.GetEmployeeAsync(BigInt(id), new AbortController().signal));

    const modModel = new EmployeeManagementModel(
      nullableBigInt(employee.assignedBranchId),
      nullableBigInt(curEmp.assignedDepartmentId),
      nullableBigInt(curEmp.reportsToId),
      curEmp.jobTitle ?? null
    );
    unwrapBridgeUnitResult(await employeeClient.ManageEmployeeAsync(BigInt(id), modModel, new AbortController().signal));

    dispatch(resetOrgChartEmployeesFetchStatus());
    dispatch(setSuccess(MESSAGES.success.employee.updateEmployee));
  } catch (error) {
    dispatch(
      setError({
        ...(error as ValidationProblemDetails),
        title: MESSAGES.error.employee.updateEmployee,
      })
    );

    const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

    return rejectWithValue(mappedError);
  }
});
