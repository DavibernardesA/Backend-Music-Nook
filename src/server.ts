import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { errorHandling } from './application/exceptions/ErrorHandling';
import userRoutes from './routes/user.routes';

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
    // this.server.use(limiter);
    // this.server.use(cookie);
  }

  private routes() {
    this.app.use('/user', userRoutes);
  }

  private errorHandling() {
    this.app.use(errorHandling);
  }
}
