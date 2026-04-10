import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { setError, setSuccess } from 'store/features';
import { CompanyLicense, ErrorResponse, ErrorResponseDTO, SystemLicense } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { Endpoints_CompanyLicense, Endpoints_BasePath } from '@fossa-app/bridge/Services/Endpoints';
import { mapCompanyLicense, mapError } from 'shared/helpers';
import { systemLicenseClient, companyLicenseClient } from 'shared/configs/BridgeClients';
import { AppAccessTokenProvider } from 'shared/configs/BridgeTransport';
import { getBackendOrigin } from '@fossa-app/bridge/Services/UrlHelpers';

export const fetchSystemLicense = createAsyncThunk<SystemLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchSystemLicense',
  async (_, { rejectWithValue }) => {
    try {
      const parsedResponse = (await systemLicenseClient.GetLicenseAsync(new AbortController().signal)) as unknown as {
        data: SystemLicense;
      };
      return parsedResponse.data || rejectWithValue({ title: MESSAGES.error.license.system.notFound });
    } catch (error: any) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);

export const fetchCompanyLicense = createAsyncThunk<CompanyLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchCompanyLicense',
  async (_, { rejectWithValue }) => {
    try {
      const data = (await companyLicenseClient.GetLicenseAsync(new AbortController().signal)) as unknown as CompanyLicense;

      return mapCompanyLicense(data);
    } catch (error) {
      return rejectWithValue({
        ...(error as ErrorResponseDTO),
        title: MESSAGES.error.license.company.notFound,
      });
    }
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
      dispatch(
        setError({
          ...(error as ErrorResponseDTO),
          title: MESSAGES.error.license.company.create,
        })
      );

      const mappedError = mapError(error as ErrorResponseDTO) as ErrorResponse<FieldValues>;

      return rejectWithValue(mappedError);
    }
  }
);
