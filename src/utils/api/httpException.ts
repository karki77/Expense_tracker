import { HTTPSTATUS } from '../enums/httpResponse';

class HttpException extends Error {
  public readonly status: HTTPSTATUS;
  public readonly message: string;
  public readonly success: boolean;
  constructor(status: HTTPSTATUS, message: string) {
    super(message);
    this.status = status;
    this.success = false;
    this.message = message;
  }
}

export default HttpException;
