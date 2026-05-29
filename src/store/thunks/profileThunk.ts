import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { setError, setSuccess, resetCompanyDatasourceTotalsFetchStatus } from 'store/features';
import { Employee, EntityInput, ErrorResponse, ValidationProblemDetails } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { unwrapBridgeUnitResult, unwrapBridgeValue } from 'shared/configs/BridgeResponses';
import { EmployeeModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapEmployee, mapError } from 'shared/helpers';

export const fetchProfile = createAsyncThunk<Employee | undefined, void, { rejectValue: ValidationProblemDetails }>(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = unwrapBridgeValue<Employee>(await employeeClient.GetCurrentEmployeeAsync(new AbortController().signal));

      if (data) {
        const state = getState() as RootState;
        const user = state.auth.user.item;

        return mapEmployee({ user, employee: data });
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ValidationProblemDetails),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const createProfile = createAsyncThunk<void, EntityInput<Employee>, { state: RootState; rejectValue: ErrorResponse<FieldValues> }>(
  'profile/createProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName ?? null);
      unwrapBridgeUnitResult(await employeeClient.CreateEmployeeAsync(modModel, new AbortController().signal));
      await dispatch(fetchProfile()).unwrap();

      dispatch(setSuccess(MESSAGES.success.employee.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.employee.create,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editProfile = createAsyncThunk<void, EntityInput<Employee>, { rejectValue: ErrorResponse<FieldValues> }>(
  'profile/editProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName ?? null);
      unwrapBridgeUnitResult(await employeeClient.UpdateCurrentEmployeeAsync(modModel, new AbortController().signal));

      dispatch(setSuccess(MESSAGES.success.employee.updateProfile));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.employee.updateProfile,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteProfile = createAsyncThunk<void, void, { rejectValue: ValidationProblemDetails }>(
  'profile/deleteProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      unwrapBridgeUnitResult(await employeeClient.DeleteCurrentEmployeeAsync(new AbortController().signal));

      dispatch(resetCompanyDatasourceTotalsFetchStatus());
      dispatch(setSuccess(MESSAGES.success.employee.deleteProfile));
    } catch (error) {
      if ((error as ValidationProblemDetails).status === 424) {
        dispatch(
          setError({
            ...(error as ValidationProblemDetails),
            title: MESSAGES.error.employee.deleteProfileDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ValidationProblemDetails),
            title: MESSAGES.error.employee.deleteProfile,
          })
        );
      }

      return rejectWithValue(error as ValidationProblemDetails);
    }
  }
);
