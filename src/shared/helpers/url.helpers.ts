export const getBackendOrigin = (frontendOrigin: string): string => {
  const suffixMappings = new Map([
    ['.dev.localhost:4211', '.dev.localhost:5210'],
    ['.test.localhost:4210', '.test.localhost:5211'],
    ['.test.localhost:4211', '.test.localhost:5211'],
    ['.localhost:4210', '.localhost:5210'],
  ]);

  for (const [frontendSuffix, backendSuffix] of suffixMappings) {
    if (frontendOrigin.endsWith(frontendSuffix)) {
      return `${frontendOrigin.slice(0, frontendOrigin.indexOf(frontendSuffix))}${backendSuffix}`;
    }
  }

  return frontendOrigin;
};

export const prepareQueryParams = (params: Record<string, any>): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return queryParams;
};

export const prepareCommaSeparatedQueryParamsByKey = (key: string, values: number[]): string => {
  return values.map((value) => `${key}=${value}`).join('&');
};
