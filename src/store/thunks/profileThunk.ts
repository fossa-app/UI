import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { setError, setSuccess, resetCompanyDatasourceTotalsFetchStatus } from 'store/features';
import { Employee, EntityInput, ErrorResponse, ProblemDetailsModel } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { foldClientResult, foldClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import { EmployeeModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { getProblemStatus, mapEmployee, mapError, createProblemDetails } from 'shared/helpers';

export const fetchProfile = createAsyncThunk<Employee | undefined, void, { rejectValue: ProblemDetailsModel }>(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const result = await employeeClient.getCurrentEmployeeAsync(new AbortController().signal);
    return foldClientResult(
      result,
      (data) => {
        const state = getState() as RootState;
        const user = state.auth.user.item;

        return mapEmployee({ user, employee: data as any });
      },
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.employee.notFound })) as never
    );
  }
);

export const createProfile = createAsyncThunk<void, EntityInput<Employee>, { state: RootState; rejectValue: ErrorResponse<FieldValues> }>(
  'profile/createProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName ?? null);

    return foldClientUnitResult(
      await employeeClient.createEmployeeAsync(modModel, new AbortController().signal),
      async () => {
        await dispatch(fetchProfile()).unwrap();

        dispatch(setSuccess(MESSAGES.success.employee.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const editProfile = createAsyncThunk<void, EntityInput<Employee>, { rejectValue: ErrorResponse<FieldValues> }>(
  'profile/editProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName ?? null);

    return foldClientUnitResult(
      await employeeClient.updateCurrentEmployeeAsync(modModel, new AbortController().signal),
      () => {
        dispatch(setSuccess(MESSAGES.success.employee.updateProfile));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.updateProfile })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const deleteProfile = createAsyncThunk<void, void, { rejectValue: ProblemDetailsModel }>(
  'profile/deleteProfile',
  async (_, { dispatch, rejectWithValue }) => {
    return foldClientUnitResult(
      await employeeClient.deleteCurrentEmployeeAsync(new AbortController().signal),
      () => {
        dispatch(resetCompanyDatasourceTotalsFetchStatus());
        dispatch(setSuccess(MESSAGES.success.employee.deleteProfile));
      },
      (problem) => {
        if (getProblemStatus(problem) === 424) {
          dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.deleteProfileDependency })));
        } else {
          dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.employee.deleteProfile })));
        }

        return rejectWithValue(problem) as never;
      }
    );
  }
);
