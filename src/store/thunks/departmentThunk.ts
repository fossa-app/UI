import type { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';
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
import { ErrorResponse, PaginatedResponse, PaginationParams, Department, Employee, EntityInput } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { departmentClient } from 'shared/configs/BridgeClients';
import { mapPaginatedResponse } from 'shared/configs/BridgeResponses';
import { foldClientResult, foldClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import { DepartmentQueryRequestModel, DepartmentModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import {
  mapDepartments,
  mapDepartmentRetrievalModel,
  mapError,
  mapDepartment,
  getEntityIdsByField,
  createProblemDetails,
} from 'shared/helpers';

const nullableBigInt = (value: bigint | number | string | null | undefined): bigint | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return BigInt(value);
};

const fetchParentDepartment = async (
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>,
  id: Department['id']
): Promise<Department> => {
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
  { rejectValue: ProblemDetailsModel }
>('department/fetchDepartmentsTotal', async (_, { rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel([], '', 1, 1);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapDepartmentRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams> & { shouldFetchEmployees?: boolean },
  { rejectValue: ProblemDetailsModel }
>('department/fetchDepartments', async ({ pageNumber, pageSize, search, shouldFetchEmployees = true }, { dispatch, rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    async (response) => {
      const data = mapPaginatedResponse(response, mapDepartmentRetrievalModel);
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
    },
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchSearchedDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { rejectValue: ProblemDetailsModel }
>('department/fetchSearchedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapDepartmentRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchParentDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ProblemDetailsModel }
>('department/fetchParentDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapDepartmentRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchAssignedDepartments = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Partial<PaginationParams>,
  { state: RootState; rejectValue: ProblemDetailsModel }
>('department/fetchAssignedDepartments', async ({ pageNumber, pageSize, search }, { rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel([], search || '', pageNumber || null, pageSize || null);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapDepartmentRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchDepartmentsByIds = createAsyncThunk<
  PaginatedResponse<Department> | undefined,
  Department['id'][],
  { rejectValue: ProblemDetailsModel }
>('department/fetchDepartmentsByIds', async (ids, { rejectWithValue }) => {
  const query = new DepartmentQueryRequestModel(ids, '', null, null);
  const result = await departmentClient.getDepartmentsAsync(query, new AbortController().signal);

  return foldClientResult(
    result,
    (response) => mapPaginatedResponse(response, mapDepartmentRetrievalModel),
    (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.departments.notFound })) as never
  );
});

export const fetchDepartmentById = createAsyncThunk<
  Department,
  {
    id: string | Department['id'];
    skipState?: boolean;
    shouldFetchParent?: boolean;
    shouldFetchDepartmentManager?: boolean;
  },
  { rejectValue: ProblemDetailsModel }
>(
  'department/fetchDepartmentById',
  async ({ id, shouldFetchParent = true, shouldFetchDepartmentManager = true }, { dispatch, rejectWithValue }): Promise<Department> => {
    try {
      const result = await departmentClient.getDepartmentAsync(BigInt(id), new AbortController().signal);
      return foldClientResult(
        result,
        async (data) => {
          const department = mapDepartmentRetrievalModel(data);
          let parentDepartment: Department | undefined;
          let manager: Employee | undefined;

          if (department.parentDepartmentId && shouldFetchParent) {
            parentDepartment = await fetchParentDepartment(dispatch, department.parentDepartmentId);
          }

          if (department.managerId && shouldFetchDepartmentManager) {
            manager = await dispatch(
              fetchEmployeeById({
                id: department.managerId,
                skipState: true,
                shouldFetchBranch: false,
                shouldFetchDepartment: false,
                shouldFetchEmployeeManager: false,
              })
            ).unwrap();
          }

          return mapDepartment(department, parentDepartment, manager);
        },
        (problem) => rejectWithValue(problem) as never
      );
    } catch (error) {
      return rejectWithValue(error as ProblemDetailsModel) as never;
    }
  }
);

export const createDepartment = createAsyncThunk<void, EntityInput<Department>, { rejectValue: ErrorResponse<FieldValues> }>(
  'department/createDepartment',
  async (department, { dispatch, rejectWithValue }) => {
    const modModel = new DepartmentModificationModel(
      department.name,
      nullableBigInt(department.parentDepartmentId),
      nullableBigInt(department.managerId)
    );

    return foldClientUnitResult(
      await departmentClient.createDepartmentAsync(modModel, new AbortController().signal),
      () => {
        dispatch(resetParentDepartments());

        dispatch(setSuccess(MESSAGES.success.departments.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.departments.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const editDepartment = createAsyncThunk<void, [string, EntityInput<Department>], { rejectValue: ErrorResponse<FieldValues> }>(
  'department/editDepartment',
  async ([id, department], { dispatch, rejectWithValue }) => {
    const modModel = new DepartmentModificationModel(
      department.name,
      nullableBigInt(department.parentDepartmentId),
      nullableBigInt(department.managerId)
    );

    return foldClientUnitResult(
      await departmentClient.updateDepartmentAsync(BigInt(id), modModel, new AbortController().signal),
      () => {
        dispatch(resetParentDepartments());

        dispatch(setSuccess(MESSAGES.success.departments.update));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.departments.update })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const deleteDepartment = createAsyncThunk<void, Department['id'], { state: RootState; rejectValue: ProblemDetailsModel }>(
  'department/deleteDepartment',
  async (id, { dispatch, rejectWithValue }) => {
    return foldClientUnitResult(
      await departmentClient.deleteDepartmentAsync(id, new AbortController().signal),
      () => {
        dispatch(resetDepartmentsFetchStatus());
        dispatch(resetParentDepartments());
        dispatch(resetCompanyDatasourceTotalsFetchStatus());
        dispatch(setSuccess(MESSAGES.success.departments.delete));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.departments.delete })));

        return rejectWithValue(problem) as never;
      }
    );
  }
);
