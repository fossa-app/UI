export const parseResponseData = <T = unknown>(data: string | object): T => {
  if (data === '') {
    return data as T;
  }

  if (typeof data === 'string') {
    const isBigNumber = (num: string | number): boolean => {
      return !isNaN(Number(num)) && !Number.isSafeInteger(Number(num));
    };

    const enquoteBigNumber = (jsonString: string, bigNumChecker: (num: string | number) => boolean): string =>
      jsonString.replaceAll(/([:\s,[]*)(\d+)([\s,\]]*)/g, (matchingSubstr, prefix, bigNum, suffix) =>
        bigNumChecker(bigNum) ? `${prefix}"${bigNum}"${suffix}` : matchingSubstr
      );

    try {
      return JSON.parse(enquoteBigNumber(data, isBigNumber), (_, value) => {
        if (value === 'string' && isBigNumber(value)) {
          // TODO: check, it never gets here
          return BigInt(value);
        }
        return value;
      }) as T;
    } catch (error) {
      console.error('Error parsing response data:', error);
      return data as T;
    }
  }

  return data as T;
};
