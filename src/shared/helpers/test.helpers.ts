import { Module, SubModule } from 'shared/models';

// TODO: check why this is not not working
export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string) => {
  return `${module}-${subModule}-${selector}`;
};
