import { Request, Response } from "express";

import response from '@helpers/response.helper';
import { TEXT } from '@constants';
import appConfig from '@configs/app.config';
import Agent from "@datasources/models/agent.model";
import { Op } from "sequelize";

const CommonController = {
  index: async (req: Request, res: Response) => {
    const agent = await Agent.findOne({
      where: {
          [Op.or]: [
              { isReserved: true,
                  orderId: '96ad5093-28ca-4f88-aab7-37126d876ed9' },
              { isReserved: false,
                  orderId: null }
          ],
      },
      order: [
          ['isReserved', 'DESC']
      ]
    })
    response.success(req, res, { version: appConfig.version,agent })
  },

  health: (req: Request, res: Response) => response.success(req, res, { status: TEXT.OK })

}


export default CommonController;