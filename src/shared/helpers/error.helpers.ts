import { FieldErrors, FieldValues } from 'react-hook-form';
import { ErrorResponse, ErrorResponseUI } from 'shared/models';

export const mapError = <T extends FieldValues>(error: ErrorResponse): ErrorResponseUI<T> => {
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
