import { Employee, EmployeeDTO } from 'shared/models';

export const mapEmployee = (employee: EmployeeDTO): Employee => {
  return employee;
};

export const mapEmployees = (employees: EmployeeDTO[]): Employee[] => {
  return employees.map(mapEmployee);
};
