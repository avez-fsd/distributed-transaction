import dotenv from 'dotenv';
dotenv.config();
import '@datasources/connection'

import routes from './routes'
import addRequestId from '@middelwares/request-id.middleware';
import response from "@helpers/response.helper"
import express, { Express } from 'express';
import CustomException from '@exceptions/custom.exception';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addRequestId);

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.use('/', routes);

// handle 404 and 5xx http code
app.use(response.handler404);
app.use(response.handler5xx);

process.on('uncaughtException', function (err: CustomException) {
    console.log(`UnhandledException spSessionId=${err.spSessionId}`, err)
  })

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});