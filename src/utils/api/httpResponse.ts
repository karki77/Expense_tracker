import { IPaginationResponse } from '#utils/pagination/types';
import { HTTPSTATUS } from '../enums/httpResponse';

export interface HttpResponseProps {
  message?: string;
  statusCode?: HTTPSTATUS;
  data?: Record<string, unknown> | unknown[] | string;
  docs?: IPaginationResponse | Record<string, unknown> | undefined;
  others?: Record<string, unknown>;
  stack?: Record<string, unknown> | string;
  pagination?: Record<string, unknown> | string;
}

export class HttpResponse {
  public readonly success: boolean;
  public readonly message: string | undefined;
  public readonly docs:
    | IPaginationResponse
    | Record<string, unknown>
    | undefined;
  public readonly data:
    | Record<string, unknown>
    | unknown[]
    | string
    | undefined;
  public readonly others: Record<string, unknown> | unknown[] | undefined;
  public readonly stack: Record<string, unknown> | string | unknown;
  public readonly pagination:
    | Record<string, unknown>
    | unknown[]
    | string
    | undefined;
  constructor({
    statusCode,
    message,
    data,
    docs,
    others,
    stack,
    pagination,
  }: HttpResponseProps) {
    statusCode = statusCode ?? 200;

    if (statusCode >= 300) {
      this.success = false;
    } else {
      this.success = true;
    }
    this.message = message;
    this.data = data;
    this.docs = docs;
    this.others = others;
    this.stack = stack;
    this.pagination = pagination;
  }
}
