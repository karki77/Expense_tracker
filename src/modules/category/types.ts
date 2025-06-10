export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface DeleteCategoryRequest {
  id: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  _count?: {
    expenses: number;
    budgets: number;
  };
}

export interface CategoryWithStats extends CategoryResponse {
  totalExpenses: number;
  expenseCount: number;
  budgetCount: number;
  currentMonthExpenses: number;
}
