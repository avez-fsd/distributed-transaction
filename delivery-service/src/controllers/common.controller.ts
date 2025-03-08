import { Request, Response } from "express";

import response from '@helpers/response.helper';
import { TEXT } from '@constants';
import appConfig from '@configs/app.config';

const CommonController = {
  index: (req: Request, res: Response) => response.success(req, res, { version: appConfig.version }),

  health: (req: Request, res: Response) => response.success(req, res, { status: TEXT.OK })

}


export default CommonController;