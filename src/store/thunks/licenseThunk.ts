import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { setError, setSuccess } from 'store/features';
import { CompanyLicense, ErrorResponse, ProblemDetailsModel, SystemLicense } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { Endpoints_CompanyLicense, Endpoints_BasePath } from '@fossa-app/bridge/Services/Endpoints';
import { mapCompanyLicense, mapError, createProblemDetails } from 'shared/helpers';
import { systemLicenseClient, companyLicenseClient } from 'shared/configs/BridgeClients';
import { matchClientResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';
import type { ClientResult$1_$union } from '@fossa-app/bridge/Models/ClientResults';
import { AppAccessTokenProvider } from 'shared/configs/BridgeTransport';
import { getBackendOrigin } from '@fossa-app/bridge/Services/UrlHelpers';

export const fetchSystemLicense = createAsyncThunk<SystemLicense | null, void, { rejectValue: ProblemDetailsModel }>(
  'license/fetchSystemLicense',
  async (_, { rejectWithValue }) => {
    const result = await systemLicenseClient.getLicenseAsync(new AbortController().signal);
    return matchClientResult(
      result,
      (data) => data,
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.license.system.notFound })) as never
    );
  }
);

export const fetchCompanyLicense = createAsyncThunk<CompanyLicense | undefined, void, { rejectValue: ProblemDetailsModel }>(
  'license/fetchCompanyLicense',
  async (_, { rejectWithValue }) => {
    const result = await companyLicenseClient.getLicenseAsync(new AbortController().signal);
    return matchClientResult(
      result,
      (data) => mapCompanyLicense(data),
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.license.company.notFound })) as never
    );
  }
);

export const uploadCompanyLicense = createAsyncThunk<void, File, { rejectValue: ErrorResponse<FieldValues> }>(
  'license/uploadCompanyLicense',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append('licenseFile', file);

      const token = await new AppAccessTokenProvider().GetTokenAsync(new AbortController().signal);
      const beOrigin = getBackendOrigin(window.location.origin);
      const url = `${beOrigin}/${Endpoints_BasePath}/${Endpoints_CompanyLicense[0]}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw await response.json();
      }

      dispatch(fetchCompanyLicense());
      dispatch(setSuccess(MESSAGES.success.license.company.create));
    } catch (error) {
      dispatch(setError(createProblemDetails(error, { Title: MESSAGES.error.license.company.create })));

      const mappedError = mapError(error as ProblemDetailsModel) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);
