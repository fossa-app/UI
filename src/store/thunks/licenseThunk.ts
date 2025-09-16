import { createAsyncThunk } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import { setError, setSuccess } from 'store/features';
import axios from 'shared/configs/axios';
import { CompanyLicense, ErrorResponse, ErrorResponseDTO, SystemLicense } from 'shared/models';
import { MESSAGES, ENDPOINTS } from 'shared/constants';
import { mapCompanyLicense, mapError, parseResponse } from 'shared/helpers';

export const fetchSystemLicense = createAsyncThunk<SystemLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchSystemLicense',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ data: SystemLicense }>(ENDPOINTS.systemLicense);
      // TODO: this should be handled in AxiosInterceptor, but this method is not being called in axios response
      const parsedResponse = parseResponse<{ data: SystemLicense }>(response);

      return parsedResponse.data || rejectWithValue({ title: MESSAGES.error.license.system.notFound });
    } catch (error: any) {
      return rejectWithValue(parseResponse<{ data: ErrorResponseDTO }>(error.response).data);
    }
  }
);

export const fetchCompanyLicense = createAsyncThunk<CompanyLicense | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'license/fetchCompanyLicense',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<CompanyLicense>(ENDPOINTS.companyLicense);

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

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post<CompanyLicense>(ENDPOINTS.companyLicense, formData, config);
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
