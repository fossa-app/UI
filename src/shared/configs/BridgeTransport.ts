import { IAccessTokenProvider } from '@fossa-app/bridge/Services/IAccessTokenProvider';
import { IHttpRequestSender, HttpRequestMessage } from '@fossa-app/bridge/Services/IHttpRequestSender';
import { unwrap } from '@fable-org/fable-library-ts/Option';
import { getUserManager } from 'shared/helpers';
import { MESSAGES } from 'shared/constants';
import store from 'store';
import { setError, removeUser } from 'store/features';
import { getBackendOrigin } from '@fossa-app/bridge/Services/UrlHelpers';
import { Endpoints_BasePath } from '@fossa-app/bridge/Services/Endpoints';

export class AppAccessTokenProvider implements IAccessTokenProvider {
  async GetTokenAsync(_cancellationToken: AbortSignal): Promise<string> {
    const userManager = getUserManager();
    let user = await userManager.getUser();

    if (!user || user.expired) {
      try {
        user = await userManager.signinSilent();
      } catch {
        return '';
      }
    }

    return user?.access_token || '';
  }
}

export class FetchHttpRequestSender implements IHttpRequestSender {
  async SendAsync(request: HttpRequestMessage, cancellationToken: AbortSignal): Promise<string> {
    const methodMap: Record<number, string> = {
      0: 'GET',
      1: 'POST',
      2: 'PUT',
      3: 'PATCH',
      4: 'DELETE',
    };

    const method = methodMap[request.Method.tag];

    const beOrigin = getBackendOrigin(window.location.origin);
    const url = `${beOrigin}/${Endpoints_BasePath}/${request.Uri.replace(/^\//, '')}`;

    const body = unwrap(request.Content);

    const headers = new Headers();
    if (request.Headers) {
      const headersArray = Array.from(request.Headers);
      headersArray.forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    // Default fetch config
    const init: RequestInit = {
      method,
      headers,
      signal: cancellationToken,
    };

    if (body !== undefined && body !== null) {
      init.body = body as string;
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (_error) {
      // Network Error
      store.dispatch(setError({ title: MESSAGES.error.general.network }));
      throw { status: 599, title: MESSAGES.error.general.network };
    }

    if (response.status === 401) {
      // Token is presumably dead or strictly unauthorized
      const userManager = getUserManager();
      try {
        await userManager.removeUser();
      } catch {
        // Ignored
      }

      store.dispatch(removeUser());
      store.dispatch(setError({ title: MESSAGES.error.general.unAuthorized }));

      // Let it redirect using our auth observer or via location
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      throw { status: 401, title: MESSAGES.error.general.unAuthorized };
    }

    if (response.status >= 500) {
      let data = {};
      try {
        data = await response.json();
      } catch {
        // Ignored
      }

      store.dispatch(setError({ title: MESSAGES.error.general.common }));
      throw { ...data, title: MESSAGES.error.general.common };
    }

    if (!response.ok) {
      // 4xx errors
      let data = {};
      try {
        data = await response.json();
      } catch {
        // Ignored
      }
      throw data;
    }

    // Attempt to return the string payload as required by IHttpRequestSender
    const text = await response.text();
    return text;
  }
}
