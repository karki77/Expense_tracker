import express from 'express';

import authRouter from './modules/auth/router';
import categoryRouter from './modules/category/router';
import expenseRouter from './modules/expense/router';
import incomeRouter from './modules/income/router';
import profileRouter from './modules/profile/router';
import fileRouter from './modules/filesystem/router';
import fileSystemRouter from './modules/filetemplate/route';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/category', categoryRouter);
appRouter.use('/expense', expenseRouter);
appRouter.use('/income', incomeRouter);
appRouter.use('/profile', profileRouter);
appRouter.use('/fileservice', fileRouter);
appRouter.use('/filetemplate', fileSystemRouter);

export default appRouter;
