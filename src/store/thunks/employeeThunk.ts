import type { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';
import { createAsyncThunk, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchById, fetchBranchesByIds, fetchDepartmentById, fetchDepartmentsByIds } from 'store/thunks';
import { resetOrgChartEmployeesFetchStatus, setError, setSuccess } from 'store/features';
import { Branch, Department, Employee, ErrorResponse, PaginatedResponse, PaginationParams } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { mapPaginatedResponse } from 'shared/configs/BridgeResponses';
import { foldClientResult, foldClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import { EmployeeQueryRequestModel, EmployeeManagementModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapEmployee, mapEmployees, mapEmployeeRetrievalModel, mapError, getEntityIdsByField, createProblemDetails } from 'shared/helpers';

const nullableBigInt = (value: bigint | number | string | null | undefined): bigint | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return BigInt(value);
};

const fetchManager = async (dispatch: ThunkDispatch<unknown, unknown, UnknownAction>, id: Employee['id']) => {
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
  { rejectValue: ProblemDetailsModel }
>(
  'employee/fetchEmployees',
  async (
    { pageNumber, pageSize, search, shouldFetchBranches = true, shouldFetchDepartments = true, shouldFetchManagers = true },
    { dispatch, rejectWithValue }
  ) => {
    const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
    const result = await employeeClient.getEmployeesAsync(query, new AbortController().signal);

    return foldClientResult(
      result,
      async (response) => {
        const data = mapPaginatedResponse(response, mapEmployeeRetrievalModel);
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
      },
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound })) as never
    );
  }
);

export const fetchManagers = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ProblemDetailsModel }
>('employee/fetchManagers', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  const query = new EmployeeQueryRequestModel([], search || '', pageNumber || null, pageSize || null, null, null);
  const result = await employeeClient.getEmployeesAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapEmployeeRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound })) as never
  );
});

export const fetchOrgChartEmployees = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ProblemDetailsModel }
>('employee/fetchOrgChartEmployees', async ({ pageNumber, pageSize }, { rejectWithValue }) => {
  try {
    const fetchSubordinates = async (reportsTo?: Employee): Promise<Employee[]> => {
      const query = new EmployeeQueryRequestModel([], '', pageNumber || null, pageSize || null, reportsTo?.id ?? null, !reportsTo);
      const result = await employeeClient.getEmployeesAsync(query, new AbortController().signal);
      const subordinateData = await foldClientResult(
        result,
        (response) => mapPaginatedResponse(response, mapEmployeeRetrievalModel),
        (problem) => {
          throw createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound });
        }
      );

      return subordinateData.items.concat((await Promise.all(subordinateData.items.map(fetchSubordinates))).flat());
    };

    return {
      items: await fetchSubordinates(),
    };
  } catch (error) {
    return rejectWithValue(createProblemDetails(error, { Title: MESSAGES.error.employee.notFound }));
  }
});

export const fetchEmployeesTotal = createAsyncThunk<PaginatedResponse<Employee> | undefined, void, { rejectValue: ProblemDetailsModel }>(
  'employee/fetchEmployeesTotal',
  async (_, { rejectWithValue }) => {
    const query = new EmployeeQueryRequestModel([], '', 1, 1, null, null);
    const result = await employeeClient.getEmployeesAsync(query, new AbortController().signal);

    return foldClientResult(
      result,
      (response) => mapPaginatedResponse(response, mapEmployeeRetrievalModel),
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound })) as never
    );
  }
);

export const fetchEmployeeById = createAsyncThunk<
  Employee,
  {
    id: string | Employee['id'];
    skipState?: boolean;
    shouldFetchBranch?: boolean;
    shouldFetchBranchGeoAddress?: boolean;
    shouldFetchDepartment?: boolean;
    shouldFetchEmployeeManager?: boolean;
  },
  { rejectValue: ProblemDetailsModel }
>(
  'employee/fetchEmployeeById',
  async (
    { id, shouldFetchBranch = true, shouldFetchBranchGeoAddress = true, shouldFetchDepartment = true, shouldFetchEmployeeManager = true },
    { dispatch, rejectWithValue }
  ) => {
    const employeeResult = await employeeClient.getEmployeeAsync(BigInt(id), new AbortController().signal);
    return foldClientResult(
      employeeResult,
      async (data) => {
        const employee = mapEmployeeRetrievalModel(data);
        let branch: Branch | undefined;
        let department: Department | undefined;
        let manager: Employee | undefined;

        if (employee.assignedBranchId && shouldFetchBranch) {
          branch = await dispatch(
            fetchBranchById({ id: employee.assignedBranchId, skipState: true, shouldFetchBranchGeoAddress })
          ).unwrap();
        }

        if (employee.assignedDepartmentId && shouldFetchDepartment) {
          department = await dispatch(fetchDepartmentById({ id: employee.assignedDepartmentId, skipState: true })).unwrap();
        }

        if (employee.reportsToId && shouldFetchEmployeeManager) {
          manager = (await fetchManager(dispatch, employee.reportsToId)) as Employee;
        }

        return mapEmployee({ branch, department, manager, employee, user: undefined });
      },
      (problem) => rejectWithValue(problem) as never
    );
  }
);

export const fetchEmployeesByIds = createAsyncThunk<
  PaginatedResponse<Employee> | undefined,
  Employee['id'][],
  { rejectValue: ProblemDetailsModel }
>('employee/fetchEmployeesByIds', async (ids, { rejectWithValue }) => {
  const query = new EmployeeQueryRequestModel(ids, '', null, null, null, null);
  const result = await employeeClient.getEmployeesAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapEmployeeRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound })) as never
  );
});

export const editEmployee = createAsyncThunk<
  void,
  [string, Pick<Employee, 'assignedBranchId' | 'assignedDepartmentId' | 'reportsToId' | 'jobTitle'>],
  { rejectValue: ErrorResponse<FieldValues> }
>('employee/editEmployee', async ([id, employee], { dispatch, rejectWithValue }) => {
  try {
    const result = await employeeClient.getEmployeeAsync(BigInt(id), new AbortController().signal);
    return foldClientResult(
      result,
      async (curEmp) => {
        const modModel = new EmployeeManagementModel(
          nullableBigInt(employee.assignedBranchId),
          nullableBigInt(employee.assignedDepartmentId),
          nullableBigInt(employee.reportsToId),
          employee.jobTitle ?? curEmp.jobTitle ?? null
        );

        return foldClientUnitResult(
          await employeeClient.manageEmployeeAsync(BigInt(id), modModel, new AbortController().signal),
          () => {
            dispatch(resetOrgChartEmployeesFetchStatus());
            dispatch(setSuccess(MESSAGES.success.employee.updateEmployee));
          },
          (problem) => {
            dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.updateEmployee })));

            const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

            return rejectWithValue(mappedError) as never;
          }
        );
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.updateEmployee })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  } catch (error) {
    dispatch(setError(createProblemDetails(error, { Title: MESSAGES.error.employee.updateEmployee })));

    const mappedError = mapError(error as ProblemDetailsModel) as ErrorResponse<FieldValues>;

    return rejectWithValue(mappedError);
  }
});
