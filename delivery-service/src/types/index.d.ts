export {}

declare global {
  namespace Express {
    export interface Request {
      rawBody: any;
      requestId?: string;
      requestTime?: string;
      fullURL?: string;
      event?: string
      eventName?: string;
    }
  }

  namespace Error {
    export interface Errback {
      message?: string;
    }
  }
}