export default class CustomException extends Error {
  requestId: string;
  spSessionId: string;
  httpCode: number;
  report?: boolean;
  data: any;

  constructor(message: string, requestId?: string, spSessionId?: string, httpCode?: number, report?: boolean, previous?: any) {
    super(message);
    this.httpCode = httpCode || 500;
    this.requestId = requestId || "";
    this.spSessionId = spSessionId || "";
    this.report = report;
    if (previous?.stack) {
      this.stack = previous.stack;
    }
    if(previous?.data) {
      this.data = previous.data;
    }
  }
}

