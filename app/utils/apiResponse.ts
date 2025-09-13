// /utils/apiResponse.ts
import { errorMessages } from './messages';

interface ResponseData {
  success: boolean;
  data?: Record<string, string> | any;
  message?: string;
  statusCode?: number;
}

export function apiError(
  data?: Record<string, string>,
  message?: string,
  statusCode: number = 400
): ResponseData {
  return {
    success: false,
    data: data || {},
    message: message || errorMessages.server,
    statusCode,
  };
}

export function apiSuccess(
  data?: any,
  message?: string,
  statusCode: number = 200
): ResponseData {
  return {
    success: true,
    data,
    message: message || '',
    statusCode,
  };
}
