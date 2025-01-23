import { AppUser, Employee, EmployeeDTO } from 'shared/models';
import { mapUserProfileToEmployee } from './user.helpers';

export const mapEmployee = (employee: EmployeeDTO, user?: AppUser): Employee => {
  return {
    ...(user ? mapUserProfileToEmployee(user.profile) : {}),
    ...employee,
  };
};

export const mapEmployees = (employees: EmployeeDTO[]): Employee[] => {
  return employees.map((employee) => mapEmployee(employee));
};
