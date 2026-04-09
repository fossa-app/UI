import { FieldErrors, FieldValues } from 'react-hook-form';
import { ProblemDetailsModel } from '@fossa-app/bridge/Models/ApiModels/SharedModels';
import type { ErrorResponse } from 'shared/types';
import { FormFieldProps } from 'components/UI/Form';
import { BridgeJsonSerializer } from 'shared/configs/BridgeSerializer';

type LegacyProblemDetailsPatch = Partial<Record<'Type' | 'Title' | 'Status' | 'Detail' | 'Instance' | 'Errors' | 'TraceId', unknown>>;
type ProblemDetailsPatch = Partial<Pick<ProblemDetailsModel, 'type' | 'title' | 'status' | 'detail' | 'instance' | 'errors' | 'traceId'>> &
  LegacyProblemDetailsPatch;

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
};

const read = <T>(
  value: unknown,
  pascalName: string,
  camelName = `${pascalName.charAt(0).toLowerCase()}${pascalName.slice(1)}`
): T | undefined => {
  const record = asRecord(value);

  return (record[camelName] ?? record[pascalName]) as T | undefined;
};

export const getProblemTitle = (problem: unknown): string | undefined => {
  return read<string>(problem, 'Title');
};

export const getProblemStatus = (problem: unknown): number | undefined => {
  const status = read<unknown>(problem, 'Status');

  return status === null || status === undefined ? undefined : Number(status);
};

export const getProblemErrors = (problem: unknown): Record<string, string[]> | undefined => {
  const errors = read<unknown>(problem, 'Errors');

  if (!errors) {
    return undefined;
  }

  if (errors instanceof Map) {
    return Object.fromEntries(errors.entries()) as Record<string, string[]>;
  }

  return typeof errors === 'object' ? (errors as Record<string, string[]>) : undefined;
};

const toProblemErrorsMap = (errors: unknown): Map<string, string[]> => {
  if (errors instanceof Map) {
    return new Map(errors.entries()) as Map<string, string[]>;
  }

  if (!errors || typeof errors !== 'object') {
    return new Map<string, string[]>();
  }

  return new Map(Object.entries(errors as Record<string, string[]>));
};

const serializer = new BridgeJsonSerializer();

const deserializeProblemDetails = (problem: unknown): ProblemDetailsModel => {
  if (!problem) {
    return {} as ProblemDetailsModel;
  }

  if (typeof problem === 'string') {
    return serializer.Deserialize<ProblemDetailsModel>(problem);
  }

  return serializer.Deserialize<ProblemDetailsModel>(JSON.stringify(problem));
};

export const createProblemDetails = (problem?: unknown, overrides: ProblemDetailsPatch = {}): ProblemDetailsModel => {
  const normalized = deserializeProblemDetails(problem);
  const normalizedOverrides = deserializeProblemDetails(overrides);
  const type = read<string>(overrides, 'Type') ?? read<string>(normalizedOverrides, 'Type') ?? read<string>(normalized, 'Type') ?? '';
  const title = read<string>(overrides, 'Title') ?? read<string>(normalizedOverrides, 'Title') ?? read<string>(normalized, 'Title') ?? null;
  const status = read<unknown>(overrides, 'Status') ?? read<unknown>(normalizedOverrides, 'Status') ?? read<unknown>(normalized, 'Status');
  const detail =
    read<string>(overrides, 'Detail') ?? read<string>(normalizedOverrides, 'Detail') ?? read<string>(normalized, 'Detail') ?? null;
  const instance =
    read<string>(overrides, 'Instance') ?? read<string>(normalizedOverrides, 'Instance') ?? read<string>(normalized, 'Instance') ?? null;
  const errors = read<unknown>(overrides, 'Errors') ?? read<unknown>(normalizedOverrides, 'Errors') ?? read<unknown>(normalized, 'Errors');
  const traceId =
    read<string>(overrides, 'TraceId') ?? read<string>(normalizedOverrides, 'TraceId') ?? read<string>(normalized, 'TraceId') ?? null;

  return {
    ...normalized,
    ...normalizedOverrides,
    type,
    title,
    status: status === null || status === undefined ? 0 : Number(status),
    detail,
    instance,
    errors: toProblemErrorsMap(errors),
    traceId,
  } as unknown as ProblemDetailsModel;
};

export const mapError = <T extends FieldValues>(error: ProblemDetailsModel): ErrorResponse<T> => {
  const errors: FieldErrors<T> = {} as FieldErrors<T>;
  const problemErrors = getProblemErrors(error);

  if (!problemErrors) {
    return { ...error, errors };
  }

  Object.entries(problemErrors).forEach(([key, messages]) => {
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
