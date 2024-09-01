import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { errorHandling } from './application/exceptions/ErrorHandling';
import RateLimiter from './application/config/request/request-limiter';
import cookie from './application/config/cookies/cookie-parser';
import userResource from './adapters/resources/user';
import authResource from './adapters/resources/auth';

export class Server {
  public app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares() {
    this.app.use(
      cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization'
      })
    );
    this.app.use(express.json());
    this.app.use(RateLimiter.getLimiter());
    this.app.use(cookie);
  }

  private routes() {
    this.app.use('/user', userResource);
    this.app.use('/auth', authResource);
  }

  private errorHandling() {
    this.app.use(errorHandling);
  }
}
