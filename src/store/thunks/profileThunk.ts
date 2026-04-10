import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { setError, setSuccess, resetCompanyDatasourceTotalsFetchStatus } from 'store/features';
import { Employee, EmployeeDTO, EntityInput, ErrorResponse, ErrorResponseDTO } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { employeeClient } from 'shared/configs/BridgeClients';
import { EmployeeModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { mapEmployee, mapError } from 'shared/helpers';

export const fetchProfile = createAsyncThunk<Employee | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = (await employeeClient.GetCurrentEmployeeAsync(new AbortController().signal)) as unknown as EmployeeDTO;

      if (data) {
        const state = getState() as RootState;
        const user = state.auth.user.item;

        return mapEmployee({ user, employee: data });
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.notFound,
      });
    }
  }
);

export const createProfile = createAsyncThunk<
  void,
  EntityInput<EmployeeDTO>,
  { state: RootState; rejectValue: ErrorResponse<FieldValues> }
>('profile/createProfile', async (employee, { dispatch, rejectWithValue }) => {
  try {
    const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName || '');
    await employeeClient.CreateEmployeeAsync(modModel, new AbortController().signal);
    await dispatch(fetchProfile()).unwrap();

    dispatch(setSuccess(MESSAGES.success.employee.create));
  } catch (error) {
    dispatch(
      setError({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.employee.create,
      })
    );

    const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

    return rejectWithValue(mappedError);
  }
});

export const editProfile = createAsyncThunk<void, EntityInput<EmployeeDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'profile/editProfile',
  async (employee, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new EmployeeModificationModel(employee.firstName, employee.lastName, employee.fullName || '');
      await employeeClient.UpdateCurrentEmployeeAsync(modModel, new AbortController().signal);

      dispatch(setSuccess(MESSAGES.success.employee.updateProfile));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.employee.updateProfile,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteProfile = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'profile/deleteProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await employeeClient.DeleteCurrentEmployeeAsync(new AbortController().signal);

      dispatch(resetCompanyDatasourceTotalsFetchStatus());
      dispatch(setSuccess(MESSAGES.success.employee.deleteProfile));
    } catch (error) {
      if ((error as ErrorResponseDTO).status === 424) {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.employee.deleteProfileDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.employee.deleteProfile,
          })
        );
      }

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);
