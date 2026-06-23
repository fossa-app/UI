import { createAsyncThunk } from '@reduxjs/toolkit';
import { createProblemDetails } from 'shared/helpers';
import { updateAuthSettings } from 'store/features';
import { ProblemDetailsModel } from 'shared/types';
import { IdentityClientRetrievalModel } from '@fossa-app/bridge/Models/ApiModels/PayloadModels';
import { MESSAGES, ROUTES } from 'shared/constants';
import { identityClient } from 'shared/configs/BridgeClients';
import { foldClientResult } from '@fossa-app/bridge/Models/Helpers/ClientResultHelpers';

export const fetchClient = createAsyncThunk<IdentityClientRetrievalModel | undefined, void, { rejectValue: ProblemDetailsModel }>(
  'identity/fetchClient',
  async (_, { dispatch, rejectWithValue }) => {
    const result = await identityClient.getClientAsync(window.location.origin, new AbortController().signal);
    return foldClientResult(
      result,
      (parsedResponse) => {
        dispatch(
          updateAuthSettings({
            client_id: parsedResponse.clientId ?? undefined,
            redirect_uri: `${window.location.origin}${ROUTES.callback.path}`,
            post_logout_redirect_uri: `${window.location.origin}/`,
          })
        );

        return parsedResponse;
      },
      (problem) => rejectWithValue(createProblemDetails(problem, { Title: MESSAGES.error.client.notFound })) as never
    );
  }
);
