// server/utils/error.ts

import { createError, H3Error } from 'h3';

export interface ErrorMessage {
  statusCode: number;
  statusMessage: string;
  field?: Record<string, string>;
}

export const throwError = (
  statusCode: number = 400,
  statusMessage: string = 'Bad Request',
  field?: string | Record<string, string>
) => {
  const data =
    typeof field === 'string'
      ? { field: { general: field } }
      : field
        ? { field }
        : undefined;

  throw createError({
    statusCode,
    statusMessage,
    data,
  }) as H3Error;
};
