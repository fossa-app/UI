import { IAccessTokenProvider } from '@fossa-app/bridge/Services/IAccessTokenProvider';
import { IHttpRequestSender, HttpRequestMessage, HttpResponseMessage } from '@fossa-app/bridge/Services/IHttpRequestSender';
import { unwrap } from '@fable-org/fable-library-ts/Option';
import { getUserManager } from 'shared/helpers';
import store from 'store';
import { removeUser } from 'store/features';
import { getBackendOrigin } from '@fossa-app/bridge/Services/UrlHelpers';

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
  async SendAsync(request: HttpRequestMessage, cancellationToken: AbortSignal): Promise<HttpResponseMessage> {
    const methodMap: Record<number, string> = {
      0: 'GET',
      1: 'POST',
      2: 'PUT',
      3: 'PATCH',
      4: 'DELETE',
    };

    const method = methodMap[request.Method.tag];

    const beOrigin = getBackendOrigin(window.location.origin);
    const url = `${beOrigin}/${request.Uri.replace(/^\//, '')}`;

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

    const response = await fetch(url, init);
    const text = await response.text();

    if (response.status === 401) {
      const userManager = getUserManager();
      try {
        await userManager.removeUser();
      } catch {
        // Ignored
      }

      store.dispatch(removeUser());

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return new HttpResponseMessage(response.status, text);
  }
}
