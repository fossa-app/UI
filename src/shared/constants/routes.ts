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
  offboarding: {
    name: 'Offboarding',
    path: '/flows/offboarding',
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
  createCompany: {
    name: 'Create Company',
    path: '/flows/onboarding/company/createCompany',
  },
  editCompany: {
    name: 'Edit Company',
    path: '/flows/company/edit',
  },
  viewCompany: {
    name: 'View Company',
    path: '/flows/company/view',
  },
  deleteCompany: {
    name: 'Delete Company',
    path: '/flows/offboarding/company/deleteCompany',
  },
  createCompanySettings: {
    name: 'Create Company Settings',
    path: '/flows/onboarding/company/createCompanySettings',
  },
  companySettings: {
    name: 'Company Settings',
    path: '/flows/company/settings',
  },
  branches: {
    name: 'Branches',
    path: '/flows/branches',
  },
  createBranch: {
    name: 'Create Branch',
    path: `/flows/onboarding/company/createBranch`,
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
  employeeOnboarding: {
    name: 'Employee Onboarding',
    path: '/flows/onboarding/employee',
  },
  employeeOffboarding: {
    name: 'Employee Offboarding',
    path: '/flows/offboarding/employee',
  },
  createEmployee: {
    name: 'Create Employee',
    path: '/flows/onboarding/employee/createEmployee',
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
  deleteEmployee: {
    name: 'Delete Employee',
    path: '/flows/offboarding/employee/deleteEmployee',
  },
  departments: {
    name: 'Departments',
    path: '/flows/departments',
  },
  uploadCompanyLicense: {
    name: 'Upload Company License',
    path: '/flows/onboarding/company/uploadCompanyLicense',
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
