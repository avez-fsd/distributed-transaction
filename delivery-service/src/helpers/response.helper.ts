import { Request, Response, NextFunction } from 'express';
import CustomException from '@exceptions/custom.exception';
import NotFoundException from "@exceptions/not-found.exception";
import logger from '@helpers/logger.helper';

const finalResponse = (req: Request, res: Response, message: string, data: any, code: number) => {
  const ok = code.toString().startsWith("2");

  if (ok) {
    res.set("Content-Type", `application/json`);
    res.send(data)
  } else if (req.headers.accept === `application/json`) {
    res.set("Content-Type", `application/json`);
    res.send({ message })
  } else {
    res.set("Content-Type", `text/html`);
    res.send(message)
  }
  return res;
}

const successApi = (req: Request, res: Response, data?: any, message = "Success", httpCode = 200) => finalResponse(req, res, message, data, httpCode);

const success = (req: Request, res: Response, data?: any, message = "Success", httpCode = 200) => {
  const responseData: any = {
    data,
    message,
  };
  return finalResponse(req, res, message, responseData, httpCode);
}

const failed = (req: Request, res: Response, message = "Failed", data?: any, httpCode = 500) => {
  const msg = message.split(" ").length > 1 ? message : message;
  return finalResponse(req, res, msg, data, httpCode);
}

const handler = {
  handler404: (req: Request, res: Response, next: any) => {
    next(new NotFoundException("Path not found", req.requestId));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handler5xx: (err: any, req: Request, res: Response, next: NextFunction) => {
    const e = err as unknown as CustomException;
    Object.assign(err, { error: err });

    if (e.report && (e.httpCode || 500).toString().startsWith('5')) logger.error(err.message || 'internal error', err);
    else if(e.report) logger.warn(err.message || 'unknown exceptions', err);

    failed(req, res, err.message || err.toString(), null, e.httpCode || 500);
  },

  successApi,

  success,
  
  failed
}

export default handler;