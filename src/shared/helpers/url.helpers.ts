import { SEARCH_CONTEXTS, SearchContext } from 'shared/constants';

export const getBackendOrigin = (frontendOrigin: string): string => {
  const suffixMappings = new Map([
    ['.dev.localhost:4211', '.dev.localhost:5210'],
    ['.test.localhost:4212', '.test.localhost:5212'],
    ['.localhost:4212', '.localhost:5210'],
  ]);

  for (const [frontendSuffix, backendSuffix] of suffixMappings) {
    if (frontendOrigin.endsWith(frontendSuffix)) {
      return `${frontendOrigin.slice(0, frontendOrigin.indexOf(frontendSuffix))}${backendSuffix}`;
    }
  }

  return frontendOrigin;
};

export const getSearchContext = (pathname: string): SearchContext => {
  for (const [context, path] of SEARCH_CONTEXTS.entries()) {
    if (pathname.includes(path)) {
      return context;
    }
  }

  return SearchContext.EMPLOYEE;
};
