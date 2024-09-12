export const getBackendOrigin = (frontendOrigin: string): string => {
  const suffixMappings = new Map([
    ['.dev.localtest.me:4211', '.dev.localtest.me:5210'],
    ['.test.localtest.me:4212', '.test.localtest.me:5212'],
    ['.localtest.me:4212', '.localtest.me:5210'],
  ]);

  for (const [frontendSuffix, backendSuffix] of suffixMappings) {
    if (frontendOrigin.endsWith(frontendSuffix)) {
      return `${frontendOrigin.slice(0, frontendOrigin.indexOf(frontendSuffix))}${backendSuffix}`;
    }
  }

  return frontendOrigin;
};
