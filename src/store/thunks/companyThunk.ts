import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchesTotal, fetchDepartmentsTotal, fetchEmployeesTotal } from 'store/thunks';
import { setError, setSuccess } from 'store/features';
import axios from 'shared/configs/axios';
import { Company, CompanyDTO, EntityInput, ErrorResponse, ErrorResponseDTO } from 'shared/types';
import { mapCompany, mapError } from 'shared/helpers';
import { MESSAGES, ENDPOINTS } from 'shared/constants';

export const fetchCompany = createAsyncThunk<Company | undefined, boolean | undefined, { rejectValue: ErrorResponseDTO }>(
  'company/fetchCompany',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyDTO>(ENDPOINTS.company);

      if (data) {
        const state = getState() as RootState;
        const countries = state.license.system.item?.entitlements.countries || [];

        return mapCompany(data, countries);
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

export const createCompany = createAsyncThunk<void, CompanyDTO, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/createCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.post<CompanyDTO>(ENDPOINTS.company, company);
      await dispatch(fetchCompany(false)).unwrap();

      dispatch(setSuccess(MESSAGES.success.company.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.company.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editCompany = createAsyncThunk<void, EntityInput<CompanyDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/editCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      await axios.put<CompanyDTO>(ENDPOINTS.company, company);

      dispatch(setSuccess(MESSAGES.success.company.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.company.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteCompany = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'company/deleteCompany',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete<void>(ENDPOINTS.company);

      dispatch(setSuccess(MESSAGES.success.company.delete));

      try {
        await dispatch(fetchCompany()).unwrap();
      } catch {
        // Ignored: fetchCompany will return 404 after delete, which is expected.
      }
    } catch (error) {
      if ((error as ErrorResponseDTO).status === 424) {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.company.deleteDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ErrorResponseDTO),
            title: MESSAGES.error.company.delete,
          })
        );
      }

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const fetchCompanyDatasourceTotals = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'company/fetchCompanyDatasourceTotals',
  async (_, { dispatch }) => {
    try {
      await dispatch(fetchBranchesTotal()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchEmployeesTotal()).unwrap();
    } catch {
      // We expect an error here
    }

    try {
      await dispatch(fetchDepartmentsTotal()).unwrap();
    } catch {
      // We expect an error here
    }
  }
);
