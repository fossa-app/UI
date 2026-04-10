import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { setError, setSuccess } from 'store/features';
import { CompanySettings, CompanySettingsDTO, EntityInput, ErrorResponse, ErrorResponseDTO } from 'shared/types';
import { MESSAGES, COMPANY_SETTINGS_KEY } from 'shared/constants';
import { mapError, saveToLocalStorage, removeFromLocalStorage } from 'shared/helpers';
import { companySettingsClient } from 'shared/configs/BridgeClients';
import { CompanySettingsModificationModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';

export const fetchCompanySettings = createAsyncThunk<CompanySettings, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/fetchCompanySettings',
  async (_, { rejectWithValue }) => {
    try {
      const data = (await companySettingsClient.GetCompanySettingsAsync(new AbortController().signal)) as unknown as CompanySettingsDTO;

      saveToLocalStorage(COMPANY_SETTINGS_KEY, data);

      return data || {};
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.companySettings.notFound,
      });
    }
  }
);

export const createCompanySettings = createAsyncThunk<void, EntityInput<CompanySettingsDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/createCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new CompanySettingsModificationModel(companySettings.colorSchemeId || '');
      await companySettingsClient.CreateCompanySettingsAsync(modModel, new AbortController().signal);
      saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
      await dispatch(fetchCompanySettings()).unwrap();

      dispatch(setSuccess(MESSAGES.success.companySettings.create));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const editCompanySettings = createAsyncThunk<void, EntityInput<CompanySettingsDTO>, { rejectValue: ErrorResponse<FieldValues> }>(
  'companySettings/editCompanySettings',
  async (companySettings, { dispatch, rejectWithValue }) => {
    try {
      const modModel = new CompanySettingsModificationModel(companySettings.colorSchemeId || '');
      await companySettingsClient.UpdateCompanySettingsAsync(modModel, new AbortController().signal);

      await dispatch(fetchCompanySettings()).unwrap();

      saveToLocalStorage(COMPANY_SETTINGS_KEY, companySettings);
      dispatch(setSuccess(MESSAGES.success.companySettings.update));
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.update,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);

export const deleteCompanySettings = createAsyncThunk<void, void, { rejectValue: ErrorResponseDTO }>(
  'companySettings/deleteCompanySettings',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await companySettingsClient.DeleteCompanySettingsAsync(new AbortController().signal);

      removeFromLocalStorage(COMPANY_SETTINGS_KEY);
      dispatch(setSuccess(MESSAGES.success.companySettings.delete));
      try {
        await dispatch(fetchCompanySettings()).unwrap();
      } catch {
        // Ignored: fetchCompanySettings will return 404 after delete, which is expected.
      }
    } catch (error) {
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.companySettings.delete,
        })
      );

      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);
