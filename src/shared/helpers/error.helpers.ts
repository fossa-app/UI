import { FieldErrors, FieldValues } from 'react-hook-form';
import { ErrorResponseDTO, ErrorResponse } from 'shared/models';
import { FormFieldProps } from 'components/UI/Form';

export const mapError = <T extends FieldValues>(error: ErrorResponseDTO): ErrorResponse<T> => {
  const errors: FieldErrors<T> = {} as FieldErrors<T>;

  if (!error.errors) {
    return { ...error, errors };
  }

  Object.entries(error.errors).forEach(([key, messages]) => {
    const pathParts = key.split('.').map((part) => part.charAt(0).toLowerCase() + part.slice(1));
    let current = errors as FieldErrors<T>;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i] as keyof T;

      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {} as FieldErrors<T>[typeof part];
      }

      if (i === pathParts.length - 1) {
        current[part] = {
          ...current[part],
          type: 'pattern',
          message: messages[0],
        };
      }

      current = current[part] as FieldErrors<T>;
    }
  });

  return { ...error, errors };
};

export const getGeneralErrorMessage = <T>(error: FieldErrors<FieldValues>, fields: FormFieldProps<T>[] = []): string | null => {
  if (Object.keys(error).length === 0) {
    return null;
  }

  if (!fields.length) {
    return (error['']?.message as string) ?? null;
  }

  const availableFields = new Set(fields.map((field) => field.name as string));

  for (const key of Object.keys(error)) {
    if (key === '' || !availableFields.has(key)) {
      const errorKey = error[key];

      if (errorKey && typeof errorKey === 'object' && 'message' in errorKey) {
        return (errorKey as { message?: string }).message ?? null;
      }
    }
  }

  return null;
};
