import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchesTotal, fetchDepartmentsTotal, fetchEmployeesTotal } from 'store/thunks';
import { setError, setSuccess } from 'store/features';
import { Company, EntityInput, ErrorResponse, ValidationProblemDetails } from 'shared/types';
import { mapCompany, mapError } from 'shared/helpers';
import { MESSAGES } from 'shared/constants';
import { companyClient } from 'shared/configs/BridgeClients';
import { unwrapBridgeUnitResult, unwrapBridgeValue } from 'shared/configs/BridgeResponses';
import { CompanyModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';

export const fetchCompany = createAsyncThunk<Company | undefined, boolean | undefined, { rejectValue: ValidationProblemDetails }>(
  'company/fetchCompany',
  async (_, { getState, rejectWithValue }) => {
    try {
      const data = unwrapBridgeValue<Company>(await companyClient.GetCompanyAsync(new AbortController().signal));

      if (data) {
        const state = getState() as RootState;
        const countries = state.license.system.item?.entitlements.countries || [];

        return mapCompany(data, countries);
      }
    } catch (error) {
      return rejectWithValue({
        ...(error as ValidationProblemDetails),
        title: MESSAGES.error.company.notFound,
      });
    }
  }
);

export const createCompany = createAsyncThunk<void, Company, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/createCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new CompanyModificationModel(company.name, company.countryCode ?? null);
      unwrapBridgeUnitResult(await companyClient.CreateCompanyAsync(modModel, new AbortController().signal));
      await dispatch(fetchCompany(false)).unwrap();

      dispatch(setSuccess(MESSAGES.success.company.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.company.create,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editCompany = createAsyncThunk<void, EntityInput<Company>, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/editCompany',
  async (company, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new CompanyModificationModel(company.name, company.countryCode ?? null);
      unwrapBridgeUnitResult(await companyClient.UpdateCompanyAsync(modModel, new AbortController().signal));

      dispatch(setSuccess(MESSAGES.success.company.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ValidationProblemDetails),
          title: MESSAGES.error.company.update,
        })
      );

      const mappedError = mapError(error as ValidationProblemDetails) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteCompany = createAsyncThunk<void, void, { rejectValue: ValidationProblemDetails }>(
  'company/deleteCompany',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      unwrapBridgeUnitResult(await companyClient.DeleteCompanyAsync(new AbortController().signal));

      dispatch(setSuccess(MESSAGES.success.company.delete));

      try {
        await dispatch(fetchCompany()).unwrap();
      } catch {
        // Ignored: fetchCompany will return 404 after delete, which is expected.
      }
    } catch (error) {
      if ((error as ValidationProblemDetails).status === 424) {
        dispatch(
          setError({
            ...(error as ValidationProblemDetails),
            title: MESSAGES.error.company.deleteDependency,
          })
        );
      } else {
        dispatch(
          setError({
            ...(error as ValidationProblemDetails),
            title: MESSAGES.error.company.delete,
          })
        );
      }

      return rejectWithValue(error as ValidationProblemDetails);
    }
  }
);

export const fetchCompanyDatasourceTotals = createAsyncThunk<void, void, { rejectValue: ValidationProblemDetails }>(
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
