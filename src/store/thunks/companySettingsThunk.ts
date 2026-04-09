import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { setError, setSuccess } from 'store/features';
import { CompanySettings, EntityInput, ErrorResponse, ProblemDetailsModel } from 'shared/types';
import { MESSAGES, COMPANY_SETTINGS_KEY } from 'shared/constants';
import { mapError, saveToLocalStorage, removeFromLocalStorage, createProblemDetails } from 'shared/helpers';
import { companySettingsClient } from 'shared/configs/BridgeClients';
import { matchClientResult, matchClientUnitResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import type { ClientResult$1_$union } from '@fossa-app/bridge/Models/ClientResults';
import { CompanySettingsModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';

export const fetchCompanySettings = createAsyncThunk<CompanySettings, void, { rejectValue: ProblemDetailsModel }>(
  'companySettings/fetchCompanySettings',
  async (_, { rejectWithValue }) => {
    const result = await companySettingsClient.getCompanySettingsAsync(new AbortController().signal);
    return matchClientResult(
      result,
      (data) => {
        saveToLocalStorage(COMPANY_SETTINGS_KEY, data);

        return (data || {}) as CompanySettings;
      },
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.companySettings.notFound })) as never
    );
  }
);

export const createCompanySettings = createAsyncThunk<void, EntityInput<CompanySettings>, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/createCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    const modModel = new CompanySettingsModificationModel(companySettings.colorSchemeId!);

    return matchClientUnitResult(
      await companySettingsClient.createCompanySettingsAsync(modModel, new AbortController().signal),
      async () => {
        saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
        await dispatch(fetchCompanySettings()).unwrap();

        dispatch(setSuccess(MESSAGES.success.companySettings.create));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.companySettings.create })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const editCompanySettings = createAsyncThunk<void, EntityInput<CompanySettings>, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/editCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    const modModel = new CompanySettingsModificationModel(companySettings.colorSchemeId!);

    return matchClientUnitResult(
      await companySettingsClient.updateCompanySettingsAsync(modModel, new AbortController().signal),
      async () => {
        await dispatch(fetchCompanySettings()).unwrap();

        saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
        dispatch(setSuccess(MESSAGES.success.companySettings.update));
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.companySettings.update })));

        const mappedError = mapError(problem) as ErrorResponse<FieldValues>;

        return rejectWithValue(mappedError) as never;
      }
    );
  }
);

export const deleteCompanySettings = createAsyncThunk<void, void, { rejectValue: ProblemDetailsModel }>(
  'companySettings/deleteCompanySettings',
  async (_, { dispatch, rejectWithValue }) => {
    return matchClientUnitResult(
      await companySettingsClient.deleteCompanySettingsAsync(new AbortController().signal),
      async () => {
        removeFromLocalStorage(COMPANY_SETTINGS_KEY);
        dispatch(setSuccess(MESSAGES.success.companySettings.delete));
        try {
          await dispatch(fetchCompanySettings()).unwrap();
        } catch {
          // Ignored: fetchCompanySettings will return 404 after delete, which is expected.
        }
      },
      (problem) => {
        dispatch(setError(createProblemDetails(problem, { Title: MESSAGES.error.companySettings.delete })));

        return rejectWithValue(problem) as never;
      }
    );
  }
);
