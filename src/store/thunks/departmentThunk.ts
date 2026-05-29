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
import {
  ValidationProblemDetails,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  Department,
  Employee,
  EntityInput,
} from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { departmentClient } from 'shared/configs/BridgeClients';
import { unwrapBridgePagingResponse, unwrapBridgeUnitResult, unwrapBridgeValue } from 'shared/configs/BridgeResponses';
import { DepartmentQueryRequestModel, DepartmentModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapDepartments, mapError, mapDepartment, getEntityIdsByField } from 'shared/helpers';

const nullableBigInt = (value: number | null | undefined): bigint | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return BigInt(value);
};

const fetchParentDepartment = async (dispatch: ThunkDispatch<unknown, unknown, UnknownAction>, id: string): Promise<Department> => {
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
  PaginatedResponse<Department> | undefined,
  void,
  { rejectValue: ValidationProblemDetails }
>('department/fetchDepartmentsTotal', async (_, { rejectWithValue }) => {
  try {
    const query = new DepartmentQueryRequestModel([], '', 1, 1);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams> & { shouldFetchEmployees?: boolean },
  { rejectValue: ValidationProblemDetails }
>('department/fetchDepartments', async ({ pageNumber, pageSize, search, shouldFetchEmployees = true }, { dispatch, rejectWithValue }) => {
  try {
    const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    if (data) {
      const departmentsManagerIds = getEntityIdsByField(data.items, 'managerId');
      const parentDepartmentsIds = getEntityIdsByField(data.items, 'parentDepartmentId');
      let employees: PaginatedResponse<Employee> | undefined;
      let parentDepartments: PaginatedResponse<Department> | undefined;

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
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchSearchedDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ValidationProblemDetails }
>('department/fetchSearchedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchParentDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ValidationProblemDetails }
>('department/fetchParentDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchAssignedDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ValidationProblemDetails }
>('department/fetchAssignedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  try {
    const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
      title: MESSAGES.error.departments.notFound,
    });
  }
});

export const fetchDepartmentsByIds = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  number[],
  { rejectValue: ValidationProblemDetails }
>('department/fetchDepartmentsByIds', async (ids, { rejectWithValue }) => {
  try {
    let idList: bigint[] = [];
    try {
      idList = ids.map((id) => BigInt(id));
    } catch {
      // Ignored
    }

    const query = new DepartmentQueryRequestModel(idList, '', null, null);
    const data = unwrapBridgePagingResponse<Department>(await departmentClient.GetDepartmentsAsync(query, new AbortController().signal));

    return data;
  } catch (error) {
    return rejectWithValue({
      ...(error as ValidationProblemDetails),
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
  { rejectValue: ValidationProblemDetails }
>(
  'department/fetchDepartmentById',
  async ({ id, shouldFetchParent = true, shouldFetchDepartmentManager = true }, { dispatch, rejectWithValue }): Promise<Department> => {
    try {
      const data = unwrapBridgeValue<Department>(await departmentClient.GetDepartmentAsync(BigInt(id), new AbortController().signal));

      let parentDepartment: Department | undefined;
      let manager: Employee | undefined;

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
      return rejectWithValue(error as ValidationProblemDetails) as never;
    }
  }
);

export const createDepartment = createAsyncThunk<void, EntityInput<Department>, { rejectValue: ErrorResponse<FieldValues> }>(
  'department/createDepartment',
  async (department, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new DepartmentModificationModel(
        department.name,
        nullableBigInt(department.parentDepartmentId),
        nullableBigInt(department.managerId)
      );
      unwrapBridgeUnitResult(await departmentClient.CreateDepartmentAsync(modModel, new AbortController().signal));

      dispatch(resetParentDepartments());

      dispatch(setSuccess(MESSAGES.success.departments.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.departments.create,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editDepartment = createAsyncThunk<void, [string, EntityInput<Department>], { rejectValue: ErrorResponse<FieldValues> }>(
  'department/editDepartment',
  async ([id, department], { dispatch, rejectWithValue }) => {
    try {
      const modModel = new DepartmentModificationModel(
        department.name,
        nullableBigInt(department.parentDepartmentId),
        nullableBigInt(department.managerId)
      );
      unwrapBridgeUnitResult(await departmentClient.UpdateDepartmentAsync(BigInt(id), modModel, new AbortController().signal));

      dispatch(resetParentDepartments());

      dispatch(setSuccess(MESSAGES.success.departments.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.departments.update,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteDepartment = createAsyncThunk<void, Department['id'], { state: RootState; rejectValue: ValidationProblemDetails }>(
  'department/deleteDepartment',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      unwrapBridgeUnitResult(await departmentClient.DeleteDepartmentAsync(BigInt(id), new AbortController().signal));

      dispatch(resetDepartmentsFetchStatus());
      dispatch(resetParentDepartments());
      dispatch(resetCompanyDatasourceTotalsFetchStatus());
      dispatch(setSuccess(MESSAGES.success.departments.delete));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.departments.delete,
        })
      );

      return rejectWithValue(error as ValidationProblemDetails);
    }
  }
);
