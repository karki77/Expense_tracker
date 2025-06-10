import express from 'express';

import authRouter from './modules/auth/router';
import categoryRouter from './modules/category/router';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/category', categoryRouter);

export default appRouter;
