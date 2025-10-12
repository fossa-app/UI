export const parseResponse = <T = unknown>(response: any): T => {
  if (response.data === '') {
    return response as T;
  }

  if (response?.headers?.['content-type']?.includes('text/html')) {
    return response as T;
  }

  if (typeof response.data === 'string') {
    const isBigNumber = (num: string | number): boolean => {
      const n = Number(num);
      return !isNaN(n) && !Number.isSafeInteger(n);
    };

    const enquoteBigNumber = (jsonString: string, bigNumChecker: (num: string | number) => boolean): string =>
      jsonString.replace(/(:\s*)(\d{15,})(\s*[,}])/g, (match, prefix, numberPart, suffix) =>
        bigNumChecker(numberPart) ? `${prefix}"${numberPart}"${suffix}` : match
      );

    try {
      return {
        ...response,
        data: JSON.parse(enquoteBigNumber(response.data, isBigNumber)),
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
