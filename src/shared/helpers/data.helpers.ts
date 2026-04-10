import { JsonSerializer } from '@fossa-app/bridge/Services/JsonSerializer';

export const parseResponse = <T = unknown>(response: any): T => {
  if (response.data === '') {
    return response as T;
  }

  if (response?.headers?.['content-type']?.includes('text/html')) {
    return response as T;
  }

  if (typeof response.data === 'string') {
    try {
      return {
        ...response,
        data: new JsonSerializer().Deserialize(response.data),
      } as T;
    } catch (error) {
      console.error('Error parsing response data:', error);
      return response as T;
    }
  }

  return response as T;
};

export const areEqualBigIds = (value1: number | string, value2: number | string): boolean => {
  try {
    return BigInt(value1) === BigInt(value2);
  } catch {
    return false;
  }
};
