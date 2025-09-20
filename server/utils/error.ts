// server/utils/error.ts
import { createError } from 'h3';

/**
 * Throw a formatted error
 * @param statusCode - HTTP status code
 * @param statusMessage - Error message
 * @param field - (Optional) field or multiple fields that caused the error
 */

export interface ErrorMessage {
  statusCode: number;
  statusMessage: string;
  field?: string | Record<string, string>;
}

export const throwError = (
  statusCode: number = 400,
  statusMessage: string = 'Bad Request',
  field?: string | Record<string, string>
) => {
  throw createError({
    statusCode,
    statusMessage,
    data: field ? { field } : undefined, // frontend can read which field failed
  });
};
