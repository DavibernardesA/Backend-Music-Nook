import cookieParser from 'cookie-parser';
import { Router } from 'express';

const cookie = Router();

cookie.use(cookieParser());

export default cookie;
