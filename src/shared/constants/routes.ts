import { AppRoute } from 'shared/models';

// TODO: use relative routes instead
export const ROUTES: AppRoute = {
  login: {
    name: 'Login',
    path: '/login',
  },
  callback: {
    name: 'Callback',
    path: '/callback',
  },
  flows: {
    name: 'Flows',
    path: '/flows',
  },
  onboarding: {
    name: 'Onboarding',
    path: '/flows/onboarding',
  },
  company: {
    name: 'Company',
    path: '/flows/company',
  },
  companyOnboarding: {
    name: 'Company Onboarding',
    path: '/flows/onboarding/company',
  },
  companyOffboarding: {
    name: 'Company Offboarding',
    path: '/flows/offboarding/company',
  },
  setupCompany: {
    name: 'Setup Company',
    path: '/flows/onboarding/company/setupCompany',
  },
  editCompany: {
    name: 'Edit Company',
    path: '/flows/company/edit',
  },
  viewCompany: {
    name: 'View Company',
    path: '/flows/company/view',
  },
  branches: {
    name: 'Branches',
    path: '/flows/branches',
  },
  setupBranch: {
    name: 'Setup Branch',
    path: `/flows/onboarding/company/setupBranch`,
  },
  newBranch: {
    name: 'Create Branch',
    path: '/flows/branches/new',
  },
  editBranch: {
    name: 'Edit Branch',
    path: '/flows/branches/edit/:id',
  },
  viewBranch: {
    name: 'View Branch',
    path: '/flows/branches/view/:id',
  },
  profile: {
    name: 'Profile',
    path: '/flows/profile',
  },
  employeeOnbarding: {
    name: 'Employee Onboarding',
    path: '/flows/onboarding/employee',
  },
  employeeOffboarding: {
    name: 'Employee Offboarding',
    path: '/flows/offboarding/employee',
  },
  setupEmployee: {
    name: 'Setup Employee',
    path: '/flows/onboarding/employee/setupEmployee',
  },
  viewProfile: {
    name: 'View Profile',
    path: '/flows/profile/view',
  },
  editProfile: {
    name: 'Edit Profile',
    path: '/flows/profile/edit',
  },
  employees: {
    name: 'Employees',
    path: '/flows/employees',
  },
  viewEmployee: {
    name: 'View Employee',
    path: '/flows/employees/view/:id',
  },
  editEmployee: {
    name: 'Edit Employee',
    path: '/flows/employees/edit/:id',
  },
  departments: {
    name: 'Departments',
    path: '/flows/departments',
  },
  newDepartment: {
    name: 'Create Department',
    path: '/flows/departments/new',
  },
  editDepartment: {
    name: 'Edit Department',
    path: '/flows/departments/edit/:id',
  },
  viewDepartment: {
    name: 'View Department',
    path: '/flows/departments/view/:id',
  },
};
