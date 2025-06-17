import express from 'express';

import authRouter from './modules/auth/router';
import categoryRouter from './modules/category/router';
import expenseRouter from './modules/expense/router';
import incomeRouter from './modules/income/router';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/category', categoryRouter);
appRouter.use('/expense', expenseRouter);
appRouter.use('/income', incomeRouter);

export default appRouter;
