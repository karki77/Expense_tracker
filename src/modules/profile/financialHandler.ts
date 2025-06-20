import { IUpdateFinancialDataSchema } from './validation';
export class FinancialHandler {
  /*
   *calculates current balance (totalIncomes - totalExpenses)
   */
  calculateCurrentBalance(financialData: IUpdateFinancialDataSchema): number {
    const totalIncomes = financialData.totalIncomes ?? 0;
    const totalExpenses = financialData.totalExpenses ?? 0;
    return totalIncomes - totalExpenses;
  }

  /*
   *calculates monthly balance (monthlyIncomes - monthlyExpenses)
   */
  calculateMonthlyBalance(financialData: IUpdateFinancialDataSchema): number {
    const monthlyIncomes = financialData.monthlyIncomes ?? 0;
    const monthlyExpenses = financialData.monthlyExpenses ?? 0;
    return monthlyIncomes - monthlyExpenses;
  }
}
