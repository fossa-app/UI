import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAuthSettings } from 'store/features';
import { ErrorResponseDTO } from 'shared/types';
import { IdentityClientRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { MESSAGES, ROUTES } from 'shared/constants';
import { identityClient } from 'shared/configs/BridgeClients';

export const fetchClient = createAsyncThunk<IdentityClientRetrievalModel | undefined, void, { rejectValue: ErrorResponseDTO }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const parsedResponse = (await identityClient.GetClientAsync(
        window.location.origin,
        new AbortController().signal
      )) as unknown as IdentityClientRetrievalModel;

      if (parsedResponse) {
        dispatch(
          updateAuthSettings({
            client_id: parsedResponse.ClientId ?? undefined,
            redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
            post_logout_redirect_uri: `${window.location.origin}/`,
          })
        );

        return parsedResponse;
      }

      return rejectWithValue({ title: MESSAGES.error.client.notFound });
    } catch (error: any) {
      return rejectWithValue(error as ErrorResponseDTO);
    }
  }
);
