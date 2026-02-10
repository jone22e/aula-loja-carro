import { Router } from 'express';
import { healthRouter } from './health.js';

export const appRouter = Router();

appRouter.use('/health', healthRouter);
