import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { RootState } from 'store';
import { fetchBranchesTotal, fetchDepartmentsTotal, fetchEmployeesTotal } from 'store/thunks';
import { setError, setSuccess } from 'store/features';
import { Company, EntityInput, ErrorResponse, ProblemDetailsModel } from 'shared/types';
import { getProblemStatus, mapCompany, mapError, createProblemDetails } from 'shared/helpers';
import { MESSAGES } from 'shared/constants';
import { companyClient } from 'shared/configs/BridgeClients';
import { foldClientResult, foldClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import { CompanyModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';

export const fetchCompany = createAsyncThunk<Company | undefined, boolean | undefined, { rejectValue: ProblemDetailsModel }>(
  'company/fetchCompany',
  async (_, { getState, rejectWithValue }) => {
    const result = await companyClient.getCompanyAsync(new AbortController().signal);
    return foldClientResult(
      result,
      (data) => {
        const state = getState() as RootState;
        const countries = state.license.system.item?.entitlements.countries || [];

        return mapCompany(data as any, countries);
      },
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.company.notFound })) as never
    );
  }
);

export const createCompany = createAsyncThunk<void, Company, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/createCompany',
  async (company, { dispatch, rejectWithValue }) => {
    const modModel = new CompanyModificationModel(company.name, company.countryCode ?? null);

    return foldClientUnitResult(
      await companyClient.createCompanyAsync(modModel, new AbortController().signal),
      async () => {
        await dispatch(fetchCompany(false)).unwrap();

        dispatch(setSuccess(MESSAGES.success.company.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.company.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const editCompany = createAsyncThunk<void, EntityInput<Company>, { rejectValue: ErrorResponse<FieldValues> }>(
  'company/editCompany',
  async (company, { dispatch, rejectWithValue }) => {
    const modModel = new CompanyModificationModel(company.name, company.countryCode ?? null);

    return foldClientUnitResult(
      await companyClient.updateCompanyAsync(modModel, new AbortController().signal),
      () => {
        dispatch(setSuccess(MESSAGES.success.company.update));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.company.update })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const deleteCompany = createAsyncThunk<void, void, { rejectValue: ProblemDetailsModel }>(
  'company/deleteCompany',
  async (_, { dispatch, rejectWithValue }) => {
    return foldClientUnitResult(
      await companyClient.deleteCompanyAsync(new AbortController().signal),
      async () => {
        dispatch(setSuccess(MESSAGES.success.company.delete));

        try {
          await dispatch(fetchCompany()).unwrap();
        } catch {
          // Ignored: fetchCompany will return 404 after delete, which is expected.
        }
      },
      (problem) => {
        if (getProblemStatus(problem) === 424) {
          dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.company.deleteDependency })));
        } else {
          dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.company.delete })));
        }

        return rejectWithValue(problem) as never;
      }
    );
  }
);

export const fetchCompanyDatasourceTotals = createAsyncThunk<void, void, { rejectValue: ProblemDetailsModel }>(
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
