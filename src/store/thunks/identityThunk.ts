import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateAuthSettings } from 'store/features';
import { ValidationProblemDetails } from 'shared/types';
import { IdentityClientRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { MESSAGES, ROUTES } from 'shared/constants';
import { identityClient } from 'shared/configs/BridgeClients';
import { unwrapBridgeValue } from 'shared/configs/BridgeResponses';

export const fetchClient = createAsyncThunk<IdentityClientRetrievalModel | undefined, void, { rejectValue: ValidationProblemDetails }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const parsedResponse = unwrapBridgeValue<IdentityClientRetrievalModel>(
        await identityClient.GetClientAsync(window.location.origin, new AbortController().signal)
      );

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
      return rejectWithValue(error as ValidationProblemDetails);
    }
  }
);
