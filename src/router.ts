import express from 'express';

import authRouter from './modules/auth/router';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);

export default appRouter;
