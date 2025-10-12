import { Module, SubModule } from 'shared/types';

// TODO: check why this is not working with component props
export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string) => {
  return `${module}-${subModule}-${selector}`;
};
