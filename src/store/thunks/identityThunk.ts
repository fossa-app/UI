import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAuthSettings } from 'store/features';
import axios from 'shared/configs/axios';
import { Client, ErrorResponseDTO } from 'shared/types';
import { MESSAGES, ROUTES, ENDPOINTS } from 'shared/constants';
import { parseResponse } from 'shared/helpers';

export const fetchClient = createAsyncThunk<Client | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get<{ data: Client }>(`${ENDPOINTS.client}?origin=${window.location.origin}`);
      // TODO: this should be handled in AxiosInterceptor, but this method is not being called in axios response
      const parsedResponse = parseResponse<{ data: Client }>(response);

      if (parsedResponse?.data) {
        dispatch(
          updateAuthSettings({
            client_id: parsedResponse.data.clientId,
            redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
            post_logout_redirect_uri: `${window.location.origin}/`,
          })
        );

        return parsedResponse.data;
      }

      return rejectWithValue({ title: MESSAGES.error.client.notFound });
    } catch (error: any) {
      return rejectWithValue(parseResponse<{ data: ErrorResponseDTO }>(error.response).data);
    }
  }
);
