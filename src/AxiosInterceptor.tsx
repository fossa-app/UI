import * as React from 'react';
import axios from 'core/axios';

interface AxiosInterceptorProps {
  children: React.ReactElement;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.isAxiosError) {
        return Promise.reject(error);
      }
    }
  );

  return children;
};

export default AxiosInterceptor;
