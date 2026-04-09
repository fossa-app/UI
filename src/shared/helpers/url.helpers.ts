export const prepareQueryParams = (params: Record<string, any>): string => {
  const filtered = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== ''));

  return new URLSearchParams(filtered).toString();
};

export const prepareCommaSeparatedQueryParamsByKey = (key: string, values: number[]): string => {
  return values.map((value) => `${key}=${value}`).join('&');
};
