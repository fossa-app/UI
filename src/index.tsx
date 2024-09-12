import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  FusionAuthProvider,
  FusionAuthProviderConfig,
} from '@fusionauth/react-sdk';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import AxiosInterceptor from 'AxiosInterceptor';
import App from './App';

const config: FusionAuthProviderConfig = {
  clientId: '***', // Use correct clientId
  redirectUri: 'http://we.dev.localtest.me:4211',
  postLogoutRedirectUri: 'http://we.dev.localtest.me:4211/login',
  // postLogoutRedirectUri: 'http://localhost:4211/logged-out',
  serverUrl: 'http://localhost:9011',
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
  scope: 'openid email profile offline_access',
  onRedirect: (state?: string) => {
    console.log(`Redirect happened with state value: ${state}`);
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FusionAuthProvider {...config}>
        <AxiosInterceptor>
          <App />
        </AxiosInterceptor>
      </FusionAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
