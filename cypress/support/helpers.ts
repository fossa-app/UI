import { Branch, ColorSchemeId, Department, EntityInput, Module, SubModule, ThemeMode } from 'shared/models';

const colorSchemeValues: ColorSchemeId[] = [
  'midnight',
  'ocean',
  'sunset',
  'sunrise',
  'forest',
  'lavender',
  'crimson',
  'harvest',
  'emerald',
];

export const getTestSelectorByModule = (module: Module, subModule: SubModule, selector: string, isPattern = false) => {
  return isPattern ? cy.get(`[data-cy*="${module}-${subModule}-${selector}"]`) : cy.get(`[data-cy="${module}-${subModule}-${selector}"]`);
};

export const getLinearLoader = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('[data-cy="linear-loader"]');
};

export const getTablePaginationSizeInput = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('.MuiTablePagination-input input');
};

export const getTablePaginationDisplayedRows = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('.MuiTablePagination-displayedRows');
};

export const getLoadingButtonLoadingIcon = (module: Module, subModule: SubModule, selector: string) => {
  return getTestSelectorByModule(module, subModule, selector).find('[data-cy="loading-button-end-icon"]');
};

export const selectOption = (module: Module, subModule: SubModule, fieldName: string, optionName: string) => {
  getTestSelectorByModule(module, subModule, `form-field-${fieldName}`).click();
  getTestSelectorByModule(module, subModule, `form-field-${fieldName}-option-${optionName}`).click();
};

export const selectAction = (module: Module, subModule: SubModule, actionType: 'edit' | 'view' | 'delete', actionId: string) => {
  getTestSelectorByModule(module, subModule, `actions-menu-icon-${actionId}`).click();
  getTestSelectorByModule(module, subModule, `action-${actionType}-${actionId}`).click();
};

export const clickField = (module: Module, subModule: SubModule, selector: string) => {
  getTestSelectorByModule(module, subModule, selector).click();
};

export const clickActionButton = (module: Module, subModule: SubModule) => {
  getTestSelectorByModule(module, subModule, 'form-submit-button').click();
};

export const search = (module: Module, subModule: SubModule, selector: string, text: string) => {
  clearInputField(module, subModule, selector);
  getTestSelectorByModule(module, subModule, selector).find('input').type(text);
};

export const openUserProfile = () => {
  getTestSelectorByModule(Module.shared, SubModule.header, 'profile-avatar').click();
  getTestSelectorByModule(Module.shared, SubModule.header, 'profile-name').should('exist').click();
};

export const fillBranchDetailsForm = (module: Module, subModule: SubModule, branch: EntityInput<Branch>) => {
  getTestSelectorByModule(module, subModule, 'form-field-name').type(branch.name);
  selectOption(module, subModule, 'timeZoneId', branch.timeZoneId);
  getTestSelectorByModule(module, subModule, 'form-field-address.line1').type(branch!.address!.line1!);

  if (branch!.address!.line2) {
    getTestSelectorByModule(module, subModule, 'form-field-address.line2').type(branch!.address!.line2);
  }

  getTestSelectorByModule(module, subModule, 'form-field-address.city').type(branch!.address!.city!);
  getTestSelectorByModule(module, subModule, 'form-field-address.subdivision').type(branch!.address!.subdivision!);
  getTestSelectorByModule(module, subModule, 'form-field-address.postalCode').type(branch!.address!.postalCode!);
  selectOption(module, subModule, 'address.countryCode', branch!.address!.countryCode!);
};

export const clearBranchDetailsForm = (module: Module, subModule: SubModule) => {
  clearInputField(module, subModule, 'form-field-name');
  clearInputField(module, subModule, 'form-field-address.line1');
  clearInputField(module, subModule, 'form-field-address.line2');
  clearInputField(module, subModule, 'form-field-address.city');
  clearInputField(module, subModule, 'form-field-address.subdivision');
  clearInputField(module, subModule, 'form-field-address.postalCode');
};

export const fillDepartmentDetailsForm = (department: Partial<Department>) => {
  if (department.name) {
    getTestSelectorByModule(Module.departmentManagement, SubModule.departmentDetails, 'form-field-name').type(department.name);
  }

  if (department.parentDepartmentId) {
    selectOption(Module.departmentManagement, SubModule.departmentDetails, 'parentDepartmentId', String(department.parentDepartmentId));
  }

  if (department.managerId) {
    selectOption(Module.departmentManagement, SubModule.departmentDetails, 'managerId', String(department.managerId));
  }
};

export const clearDepartmentDetailsForm = () => {
  clearInputField(Module.departmentManagement, SubModule.departmentDetails, 'form-field-name');
  clearInputField(Module.departmentManagement, SubModule.departmentDetails, 'form-field-managerId');
};

export const clearInputField = (module: Module, subModule: SubModule, selector: string) => {
  getTestSelectorByModule(module, subModule, selector).find('input').type('{selectall}{backspace}', { delay: 150, force: true });
};

export const verifyTextFields = (module: Module, subModule: SubModule, fieldValues: { [key: string]: string }) => {
  Object.entries(fieldValues).forEach(([field, value]) => {
    getTestSelectorByModule(module, subModule, field).should('have.text', value);
  });
};

export const verifyInputFields = (module: Module, subModule: SubModule, fieldValues: { [key: string]: string }) => {
  Object.entries(fieldValues).forEach(([field, value]) => {
    getTestSelectorByModule(module, subModule, field).find('input').should('have.value', value);
  });
};

export const verifyNotExist = (module: Module, subModule: SubModule, fields: string[]) => {
  fields.forEach((field) => {
    getTestSelectorByModule(module, subModule, field).should('not.exist');
  });
};

export const verifyBranchDetailsFormFieldsExist = (fieldKeys: string[]) => {
  fieldKeys.forEach((field) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).should('exist');
  });
};

export const verifyBranchDetailsFormFieldsNotExist = (fieldKeys: string[]) => {
  fieldKeys.forEach((field) => {
    getTestSelectorByModule(Module.branchManagement, SubModule.branchDetails, field).should('not.exist');
  });
};

export const verifyFormValidationMessages = (module: Module, subModule: SubModule, validations: { field: string; message: string }[]) => {
  validations.forEach(({ field, message }) => {
    getTestSelectorByModule(module, subModule, field).should('exist').and('have.text', message);
  });
};

export const verifyOptions = (module: Module, subModule: SubModule, selector: string, expectedValues: string[]) => {
  getTestSelectorByModule(module, subModule, selector, true)
    .should('have.length', expectedValues.length)
    .then((items) => {
      cy.wrap(items).each((item, index) => {
        cy.wrap(item).invoke('attr', 'data-cy').should('include', expectedValues[index]);
      });
    });
};

export const selectNavigationMenuItem = (menuItem: string) => {
  getTestSelectorByModule(Module.shared, SubModule.header, 'menu-icon').click();
  getTestSelectorByModule(Module.shared, SubModule.menu, `menu-item-${menuItem}`).click();
};

export const clickFlow = (flowName: string) => {
  getTestSelectorByModule(Module.manage, SubModule.flows, `flow-group-${flowName}`).click();
};

export const clickSubFlow = (subFlowName: string) => {
  getTestSelectorByModule(Module.manage, SubModule.flows, `flow-item-${subFlowName}`).click();
};

export const clickFlowsIcon = () => {
  getTestSelectorByModule(Module.shared, SubModule.header, 'flows-icon').click();
};

export const checkIsSubFlowDisabled = (subFlowName: string, isDisabled: boolean) => {
  const selector = getTestSelectorByModule(Module.manage, SubModule.flows, `flow-item-${subFlowName}`);

  selector.should(isDisabled ? 'have.attr' : 'not.have.attr', 'disabled');
};

export const checkIsSubFlowHasDisabledAttribute = (subFlowName: string, isDisabled: boolean) => {
  const selector = `[data-cy="${Module.manage}-${SubModule.flows}-flow-item-${subFlowName}"] a`;

  cy.get(selector).should(isDisabled ? 'have.attr' : 'not.have.attr', 'aria-disabled', 'true');
};

export const verifyRadioGroupValue = (name: string, expectedValue: string) => {
  colorSchemeValues.forEach((value) => {
    const assertion = value === expectedValue ? 'be.checked' : 'not.be.checked';

    cy.get(`input[name="${name}"][value="${value}"]`).should(assertion);
  });
};

export const selectColorScheme = (module: Module, subModule: SubModule, selector: string) => {
  getTestSelectorByModule(module, subModule, selector).click();
};

export const verifyAppTheme = (theme: ThemeMode, colorScheme: ColorSchemeId) => {
  getTestSelectorByModule(Module.shared, SubModule.theme, 'app-theme')
    .should('have.attr', 'data-theme', theme)
    .and('have.attr', 'data-color-scheme-id', colorScheme);
};

export const checkEmployeeReportsTo = (employeeId: string, managerId: string | null) => {
  const selector = getTestSelectorByModule(
    Module.employeeManagement,
    SubModule.employeeOrgChart,
    `employee-card-${employeeId}-reportsTo`,
    true
  );

  selector.should('exist').and('have.attr', 'data-cy').and('include', `-reportsTo-${managerId}`);
};

export const uploadTestFile = (selector: string, fixtureName: string, fileType = 'application/octet-stream') => {
  cy.fixture(fixtureName, 'binary').then((fileContent) => {
    const blob = Cypress.Blob.binaryStringToBlob(fileContent, fileType);
    const file = new File([blob], fixtureName, { type: fileType });

    cy.get(selector).then(($input) => {
      const inputElement = $input[0] as HTMLInputElement;
      const dataTransfer = new DataTransfer();

      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;

      cy.wrap($input).trigger('change', { force: true });
    });
  });
};

export const createMockLicensePeriod = (validForDays: number): { notBefore: string; notAfter: string } => {
  const MS_IN_DAY = 24 * 60 * 60 * 1000;
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const notAfterDate = new Date(now.getTime() + validForDays * MS_IN_DAY);
  const notBeforeDate = new Date(notAfterDate.getTime() - 365 * MS_IN_DAY);
  const formatDate = (date: Date) => date.toISOString().replace('Z', '+00:00');

  return {
    notBefore: formatDate(notBeforeDate),
    notAfter: formatDate(notAfterDate),
  };
};

export const formatMockDateToLocaleString = (mockDateString: string): string => {
  return new Date(mockDateString).toLocaleDateString();
};
