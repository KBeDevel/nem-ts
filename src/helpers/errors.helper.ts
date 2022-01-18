import type { NextFunction, Request, Response } from 'express';
import type { ResponseBody } from '../types';
import { HTTPError } from '../libs/http-error.lib';
import { MESSAGES } from './schemas.helper';
import { SERVER_ERROR_RESPONSE_CODES } from '../libs/http-response-codes/server-error';
import { CLIENT_ERROR_RESPONSE_CODES } from '../libs/http-response-codes/client-error';

export type ErrorTemplateData = {
  error: {
    title: string;
    message: string;
    helper?: string;
    stack?: string;
  };
  showDocsAlert?: boolean;
  errorCode: number | string;
};

export default class RequestErrorsHelper {
  public static createErrorOutput (errorReason: string): ResponseBody<null> {
    return {
      error: {
        value: true,
        message: errorReason,
        timestamp: Date.now()
      },
      value: null
    };
  }

  public static useErrorOutput (usingResponse: Response, reason: string, errorCode: number | string): void {
    usingResponse.status(parseInt(String(errorCode))).json(RequestErrorsHelper.createErrorOutput(reason));
  }

  public static useErrorTemplate (usingResponse: Response, data: ErrorTemplateData): void {
    usingResponse.status(parseInt(String(data.errorCode))).render('error', data);
  }

  public static generic (error: Error | HTTPError, request: Request, response: Response, next: NextFunction): void {
    if (response.headersSent) {
      return next(error);
    }
    const isHTTPError = !!(error as HTTPError).httpCode;
    const httpErrorCode = isHTTPError
      ? (error as HTTPError).httpCode
      : SERVER_ERROR_RESPONSE_CODES.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line security-node/detect-crlf
    console.log('HTTP status code:', response.statusCode, 'Error stack:\n', error);
    if (request.headers.accept === 'application/json') {
      RequestErrorsHelper.useErrorOutput(response, isHTTPError ? error.message : MESSAGES.DEFAULT_RESPONSE_VALUES.INTERNAL_SERVER_ERROR, httpErrorCode);
    } else {
      RequestErrorsHelper.useErrorTemplate(response, {
        error: {
          title: 'Error ' + httpErrorCode,
          message: MESSAGES.DEFAULT_RESPONSE_VALUES.INTERNAL_SERVER_ERROR
        },
        errorCode: httpErrorCode
      });
    }
  }

  public static resourceNotFound (request: Request, response: Response): void {
    if (request.headers.accept === 'application/json') {
      RequestErrorsHelper.useErrorOutput(
        response,
        MESSAGES.DEFAULT_RESPONSE_VALUES.RESOURCE_NOT_FOUND,
        CLIENT_ERROR_RESPONSE_CODES.NOT_FOUND
      );
    } else {
      RequestErrorsHelper.useErrorTemplate(response, {
        error: {
          title: 'Error 404',
          message: MESSAGES.DEFAULT_RESPONSE_VALUES.RESOURCE_NOT_FOUND
        },
        errorCode: CLIENT_ERROR_RESPONSE_CODES.NOT_FOUND
      });
    }
  }
}
